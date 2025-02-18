import mongoose from "mongoose";
import Blog from "./Schema/Blog.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Connect to your MongoDB (replace with your connection string)
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function migrateBlogs() {
    try {
        // Find all blogs
        const blogs = await Blog.find({});
        for (let blog of blogs) {
            // Check if content is an object (and not an array) with a `blocks` property
            if (
                blog.content &&
                typeof blog.content === "object" &&
                !Array.isArray(blog.content) &&
                blog.content.blocks
            ) {
                console.log(`Migrating blog: ${blog._id}`);
                // Update the content field to only be the blocks array
                blog.content = blog.content.blocks;
                await blog.save();
            }
        }
        console.log("Migration complete.");
    } catch (error) {
        console.error("Migration error:", error);
    } finally {
        mongoose.disconnect();
    }
}

migrateBlogs();



