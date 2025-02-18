import mongoose, { Schema } from "mongoose";

const blogSchema = new Schema({
    blog_id: {
        type: String,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true,
    },
    banner: {
        type: String,
    },
    des: {
        type: String,
        maxlength: 200,
    },
    content: {
        type: mongoose.Schema.Types.Mixed,
    },
    tags: {
        type: [String],
    },
    author: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'users'
    },
    activity: {
        total_likes: {
            type: Number,
            default: 0
        },
        total_comments: {
            type: Number,
            default: 0
        },
        total_reads: {
            type: Number,
            default: 0
        },
        total_parent_comments: {
            type: Number,
            default: 0
        },
    },
    comments: {
        type: [Schema.Types.ObjectId],
        ref: 'comments'
    },
    draft: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: {
        createdAt: 'publishedAt'
    }
});

export default mongoose.model("blogs", blogSchema);