import { Router } from "express";
import multer from "multer";
const router = Router();
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import {
  AddBlogPageHandler,
  ShowAllBlogsHandler,
  showBlog,
  AddBlogHandle,
  CommentHandler,
  likeBlog,
  SearchHandler,
} from "../controller/blog.controller.js";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET // Click 'View API Keys' above to copy your API secret
});


// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "./public/upload/"), // FOR LOCAL DATA BASE
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

//? Blog-related routes with authentication for adding blogs
router.get("/", AddBlogPageHandler);

router.post("/addBlog", upload.single("image"), async (req, res, next) => {
  const uploadResult = await cloudinary.uploader
    .upload(req.file.path, {
      folder: "blog-images", // Enhance image quality for better performance and display.
    })
    .catch((error) => {
      console.log(error);
    });
  fs.unlink(req.file.path, (err) => {
    if (err) {
      console.error("Error while deleting file from local storage:", err);
    }
  });
  if (!uploadResult) {
    return res.status(400).send("No file uploaded.");
  }
  req.body.image = uploadResult.secure_url;

  AddBlogHandle(req, res, next);
});

router.get("/allBlogs", ShowAllBlogsHandler);
router.get("/allBlogs/:id", showBlog);
router.get("/result", SearchHandler);
router.get("/:id", showBlog);
router.post("/comment/:id", CommentHandler); // Authentication added for commenting
router.post("/:id/like", likeBlog);

export default router;
