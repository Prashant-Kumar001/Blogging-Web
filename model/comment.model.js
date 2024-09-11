import e from "express";
import mongoose from "mongoose";
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    comments: {
        type: String,
        required: true
    },
    userName:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    email_to: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    post_id: {
        type: String,
        require: true
    }
});

const Blog = mongoose.model('comments', blogSchema);

export default Blog;
