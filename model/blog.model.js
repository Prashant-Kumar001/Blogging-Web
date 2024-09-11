import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// Define default categories
const defaultCategories = [
  'Technology', 'Health', 'Finance', 'Lifestyle', 'Education', 'Travel'
];

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [...defaultCategories, 'Custom'], // Include a 'Custom' category
  },
  customCategory: {
    type: String,
    default: ''
  },
  image: {
    type: String,
    default: 'no image'
  },
  email: {
    type: String,
    required: true
  },
  Views: {
    type: Number,
    default: 0
  },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  likes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  tags: {
    type: [String],
    default: []
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  author: {
    type: String,
    required: true
  }
});

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
