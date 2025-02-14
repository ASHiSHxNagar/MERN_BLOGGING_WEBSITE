import express from 'express'
import mongoose from 'mongoose';
import 'dotenv/config'
import bcrypt from 'bcrypt'
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken'
import cors from 'cors'
import admin from 'firebase-admin'
import serviceAccountKey from './mern-blogging-yt-c12b2-firebase-adminsdk-fbsvc-fbdb68d261.json' assert { type: "json" }
import { getAuth } from 'firebase-admin/auth'
import aws from 'aws-sdk'
// schema below
import User from './Schema/User.js'
import Blog from './Schema/Blog.js'

const app = express();
const PORT = 3000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

mongoose.connect(process.env.MONGO_URI, {
    autoIndex: true
});

app.use(express.json());
app.use(cors());

// Set COOP header
app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    next();
});

// setting up s3 bucket
const s3 = new aws.S3({
    region: 'eu-north-1',
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const generateUploadURL = async () => {
    const date = new Date();
    const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

    return await s3.getSignedUrlPromise('putObject', {
        Bucket: 'mernblogwebsiteyt-mordernwebdev',
        Key: imageName,
        Expires: 1000,
        ContentType: 'image/jpeg'
    });
};

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: "Forbidden" });
        }
        req.user = user.id;
        next();
    });
};

const formatDataToSend = (user) => {
    const access_token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return {
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname: user.personal_info.fullname,
    };
};

const generateUsername = async (email) => {
    let username = email.split("@")[0];

    let usernameExists = await User.exists({ "personal_info.username": username }).then((result) => result);
    if (usernameExists) {
        username += nanoid().substring(0, 5);
    }

    return username;
};

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

// upload image url route
app.get('/get-upload-url', async (req, res) => {
    generateUploadURL().then((url) => {
        return res.status(200).json({ uploadURL: url });
    }).catch(err => {
        return res.status(500).json({ "error": err.message });
    });
});

app.post("/signup", (req, res) => {
    let { fullname, email, password } = req.body;
    // validating data from frontend
    if (fullname.length < 3) {
        return res.status(403).json({ "error": "Fullname must be at least 3 letters long" });
    }
    if (!email.length) {
        return res.status(403).json({ "error": "Enter Email" });
    }
    if (!emailRegex.test(email)) {
        return res.status(403).json({ "error": "Email is Invalid" });
    }
    if (!passwordRegex.test(password)) {
        return res.status(403).json({ "error": "Password should be 6 to 20 characters long with numeric, 1 lowercase and 1 uppercase letters" });
    }

    bcrypt.hash(password, 10, async (err, hashed_password) => {
        if (err) {
            return res.status(500).json({ "error": "Error hashing password" });
        }

        let username = await generateUsername(email);

        let user = new User({
            personal_info: { fullname, email, password: hashed_password, username }
        });

        user.save().then((u) => {
            return res.status(200).json(formatDataToSend(u));
        }).catch(err => {
            if (err.code == 11000) {
                return res.status(500).json({ "error": "Email already exists" });
            }
            return res.status(500).json({ "error": err.message });
        });
    });
});

app.post('/signin', (req, res) => {
    let { email, password } = req.body;
    User.findOne({ "personal_info.email": email }).then((user) => {
        if (!user) {
            return res.status(403).json({ "error": "Email not found" });
        }

        if (!user.google_auth) {
            bcrypt.compare(password, user.personal_info.password, (err, result) => {
                if (err) {
                    return res.status(403).json({ "error": "Error occurred while login, please try again" });
                }
                if (!result) {
                    return res.status(403).json({ "error": "Incorrect Password" });
                } else {
                    return res.status(200).json(formatDataToSend(user));
                }
            });
        } else {
            return res.status(403).json({ "error": "Account was created using Google. Try using Google." });
        }
    }).catch(err => {
        console.log(err);
        return res.status(500).json({ "error": err.message });
    });
});

app.post('/google-auth', async (req, res) => {
    let { access_token } = req.body;

    getAuth()
        .verifyIdToken(access_token)
        .then(async (decodedUser) => {
            let { email, name, picture } = decodedUser;

            picture = picture.replace("s96-c", "s384-c");

            let user = await User.findOne({ "personal_info.email": email }).select("personal_info.fullname personal_info.username personal_info.profile_img google_auth ")
                .then((u) => {
                    return u || null;
                }).catch(err => {
                    return res.status(500).json({ "error": err.message });
                });

            if (user) {
                // login
                if (!user.google_auth) {
                    return res.status(403).json({ "error": "This email was signed up without Google. Please log in with password to access your account" });
                }
            } else {
                // signup
                let username = await generateUsername(email);

                user = new User({
                    personal_info: { fullname: name, email, username, profile_img: picture },
                    google_auth: true
                });

                await user.save().then((u) => {
                    user = u;
                }).catch(err => {
                    return res.status(500).json({ "error": err.message });
                });
            }
            return res.status(200).json(formatDataToSend(user));
        }).catch(err => {
            return res.status(500).json({ "error": "Failed to authenticate you with Google. Try with some other Google account" });
        });
});

app.post('/latest-blogs', (req, res) => {
    let { page } = req.body;

    let maxLimit = 5;
    Blog.find({ draft: false })
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then((blogs) => {
            return res.status(200).json({ blogs });
        }).catch(err => {
            return res.status(500).json({ "error": err.message });
        });
});

app.post("/all-latest-blogs-count", (req, res) => {
    Blog.countDocuments({ draft: false })
        .then(count => {
            return res.status(200).json({ totalDocs: count });
        })
        .catch(err => {
            return res.status(500).json({ "error": err.message });
        });
});



app.get('/trending-blogs', (req, res) => {
    Blog.find({ draft: false })
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
        .sort({ "activity.total_read": -1, "activity.total_likes": -1, "publishedAt": -1 })
        .select("blog_id title publishedAt -_id")
        .limit(5)
        .then((blogs) => {
            return res.status(200).json({ blogs });
        }).catch(err => {
            return res.status(500).json({ "error": err.message });
        });
});

app.post('/search-blogs', (req, res) => {
    let { tag, author, page, query } = req.body;
    let findQuery

    if (tag) {
        findQuery = { tags: tag, draft: false };
    }
    else if (query) {
        findQuery = { draft: false, title: new RegExp(query, 'i') }
    }
    else if (author) {
        findQuery = { author, draft: false }
    }
    let maxLimit = 2;
    Blog.find(findQuery)
        .populate('author', 'personal_info.profile_img personal_info.username personal_info.fullname -_id')
        .sort({ "publishedAt": -1 })
        .select("blog_id title des banner activity tags publishedAt -_id")
        .skip((page - 1) * maxLimit)
        .limit(maxLimit)
        .then((blogs) => {
            return res.status(200).json({ blogs });
        }).catch(err => {
            return res.status(500).json({ "error": err.message });
        });
});

app.post("/search-blogs-count", (req, res) => {
    let { tag, author, query } = req.body

    let findQuery

    if (tag) {
        findQuery = { tags: tag, draft: false };
    }
    else if (query) {
        findQuery = { draft: false, title: new RegExp(query, 'i') }
    }
    else if (author) {
        findQuery = { author, draft: false }
    }

    Blog.countDocuments(findQuery)
        .then(count => {
            return res.status(200).json({ totalDocs: count });
        })
        .catch(err => {
            return res.status(500).json({ "error": err.message });
        });
});

app.post("/search-users", (req, res) => {
    let { query } = req.body;

    User.find({ "personal_info.username": new RegExp(query, 'i') })
        .limit(50)
        .select("personal_info.fullname personal_info.username personal_info.profile_img -_id")
        .then(users => {
            return res.status(200).json({ users });
        })
        .catch(err => {
            return res.status(500).json({ "error": err.message });
        })
})

app.post("/get-profile", (req, res) => {
    let { username } = req.body;

    User.findOne({ "personal_info.username": username })
        .select("-personal_info.password -google_auth -updatedAt -blogs ")
        .then(user => {
            return res.status(200).json(user);
        })
        .catch(err => {
            return res.status(500).json({ "error": err.message });
        })
})


app.post('/create-blog', verifyJWT, (req, res) => {
    let authorId = req.user;

    let { title, des, banner, tags, content, draft = undefined } = req.body;

    if (!title.length) {
        return res.status(403).json({ "error": "Title is required" });
    }
    if (!draft) {
        if (!des.length || des.length > 200) {
            return res.status(403).json({ "error": "Description is required under 200 characters" });
        }
        if (!banner.length) {
            return res.status(403).json({ "error": "Banner is required" });
        }
        if (!content.blocks.length) {
            return res.status(403).json({ "error": "Content is required to publish the blog" });
        }
        if (!tags.length || tags.length > 10) {
            return res.status(403).json({ "error": "Tags are required, Maximum 10" });
        }
    }

    tags = tags.map(tag => tag.toLowerCase());

    let blog_id = title.replace(/[^a-zA-Z0-9]/g, '').replace(/\s+/g, '-').trim() + nanoid();
    let newBlog = new Blog({
        title,
        des,
        banner,
        tags,
        author: authorId,
        blog_id,
        draft: Boolean(draft),
    });
    newBlog.save().then((blog) => {
        let incrementVal = draft ? 0 : 1;

        User.findOneAndUpdate({ _id: authorId }, { $inc: { "account_info.total_posts": incrementVal }, $push: { "blogs": blog._id } })
            .then((user) => {
                return res.status(200).json({ id: blog._id });
            })
            .catch(err => res.status(500).json({ "error": err.message }));
    })
        .catch(err => { return res.status(500).json({ "error": err.message }); });
});

app.listen(PORT, (req, res) => {
    console.log('listening at port ', PORT);
});