import blog from "../model/blog.model.js";
import mongoose from "mongoose";
import person from "../model/user.model.js";
import comment from "../model/comment.model.js";
/**
 * Renders the page for adding a new blog.
 */
export async function AddBlogPageHandler(req, res) {
  try {
    return res.render("addBlog", {
      name: req.user.FullName,
      title: "addBlog",
    });
  } catch (error) {
    return res.status(500).render("error", {
      errorCode: 500,
      errorTitle: "Internal Server Error",
      errorMessage: "Something went wrong on our end. We are working on it!",
    });
  }
}

/**
 * Handles the form submission for adding a new blog.
 */
export async function AddBlogHandle(req, res) {
  try {
    const {
      title,
      content,
      category,
      customCategory = "",
      tags = "",
      visibility = "public",
      image,
    } = req.body;

    if (!title || !content || (!category && !customCategory)) {
      return res
        .status(400)
        .json({ error: "All required fields are not provided" });
    }

    const finalCategory =
      category === "Custom" ? customCategory.trim() : category.trim();
    const tagsArray = tags
      .split(" ")
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0);

    // Validate finalCategory against your allowed categories

    const newBlog = await blog.create({
      title: title.trim(),
      content: content.trim(),
      category: category === "Custom" ? "Custom" : finalCategory,
      email: req.user.email,
      image: req.body.image ? image : "no image",
      visibility,
      tags: tagsArray,
      author: req.user.FullName,
      customCategory: category === "Custom" ? finalCategory : "",
    });

    return res.render("blogDetail", { blog: newBlog, name: req.user.FullName });
  } catch (error) {
    console.error("Error adding blog:", error);
    return res.status(500).render("error", {
      errorCode: 500,
      errorTitle: "Internal Server Error",
      errorMessage: "Something went wrong on our end. We are working on it!",
    });
  }
}

/**
 * Displays all blogs created by the current user.
 */
export async function ShowAllBlogsHandler(req, res) {
  try {
    // Find blogs by the user's email and ensure they are public
    const blogs = await blog.find({
      email: req.user.email,
    });
    // Render the view with the blogs and user's name
    return res.render("ShowAllBlog", {
      blogs,
      name: req.user.FullName,
      title: "allBlogs",
    });
  } catch (error) {
    console.error("Error retrieving blogs:", error);
    return res.status(500).render("error", {
      errorCode: 500,
      errorTitle: "Internal Server Error",
      errorMessage: "Something went wrong on our end. We are working on it!",
    });
  }
}


/**
 * Handles adding a comment to a blog post.
 */
export async function CommentHandler(req, res) {
  try {
    const { comments } = req.body;
    if (!comments) {
      return res.status(400).send({ error: "Please enter a comment" });
    }

    const blogId = req.params.id;
    const blogDetails = await blog.findById(blogId);
    const author = await person.findOne({ email: blogDetails.email });

    await comment.create({
      comments,
      email: req.user.email,
      email_to: author.email,
      post_id: blogId,
      userName: req.user.FullName,
    });

    res.redirect(`/blog/${blogId}`);
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).render("error", {
      errorCode: 500,
      errorTitle: "Internal Server Error",
      errorMessage: "Something went wrong on our end. We are working on it!",
    });
  }
}

/**
 * Shows a blog post along with its comments.
 */
export async function showBlog(req, res) {
  const blogId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(404).render("error", {
      errorCode: 404,
      errorTitle: "Page Not Found",
      errorMessage:
        "invalid id: ",
    });
  }

  try {
    // Fetch blog details
    const blogDetails = await blog.findById(blogId);
    if (!blogDetails) {
      return res.status(404).render("error", {
        errorCode: 404,
        errorTitle: "Page Not Found",
        errorMessage:
          "blog not found.",
      });
    }

    // Fetch author details
    const author = await person.findOne({ email: blogDetails.email });
    const authorName = author ? author.FullName : "Unknown";
    const authorBio = author
      ? author.bio
        ? author.bio
        : "No bio available"
      : "No bio available";

    // Fetch comments and related posts
    const allComments = await comment.find({ post_id: blogId });
    const relatedPosts = await blog
      .find({
        category:
          blogDetails.category === "Custom"
            ? blogDetails.customCategory
            : blogDetails.category,
        visibility: "public",
        _id: { $ne: blogId },
      })
      .limit(3);

    // Fetch recent posts by the same author
    const authorPosts = await blog
      .find({
        email: blogDetails.email,
        visibility: "public",
        _id: { $ne: blogId },
      })
      .limit(5);

    // Prepare data to pass to the view
    const viewData = {
      blog: blogDetails,
      author: authorName,
      email: author ? author.email : "Unknown",
      comment: allComments,
      length: allComments.length,
      authorBio: authorBio,
      relatedPosts: relatedPosts,
      authorPosts: authorPosts,
      name: req.user ? req.user.FullName : null,
      Views: blogDetails.Views,
      user: req?.user?.id,
    };

    // update Views
    blogDetails.Views += 1;
    await blogDetails.save();

    res.render("posts", viewData);
  } catch (error) {
    console.log(error);
    res.status(500).render("error", {
      errorCode: 500,
      errorTitle: "Internal Server Error",
      errorMessage: "Something went wrong on our end. We are working on it!",
    });
  }
}

/**
 * Handles searching for blogs by title.
 */
export async function SearchHandler(req, res) {
  const query = req.query.query || "";
  try {
    const results = await blog.find({
      visibility: "public",
      $or: [
        { title: { $regex: query, $options: "i" } }, // Case-insensitive search in title
        { tags: { $regex: query, $options: "i" } }, // Case-insensitive search in tags array
        { category: { $regex: query, $options: "i" } }, // Case-insensitive search in category
      ],
    });
    const viewData = {
      results,
      query,
    };
    if (req.user) {
      viewData.name = req.user.FullName;
    }
    res.render("searchResults", viewData);
  } catch (error) {
    console.error("Error searching posts:", error);
    return res.status(500).render("error", {
      errorCode: 500,
      errorTitle: "Internal Server Error",
      errorMessage: "Error searching posts!",
    });
  }
}

export async function likeBlog(req, res) {
  const blogId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(blogId)) {
    return res.status(400).json({ error: "Invalid blog ID" });
  }

  try {
    if (req.user) {
      const userId = req.user.id; // Assuming `req.user` contains the authenticated user's details
      const blogDetails = await blog.findById(blogId);
      if (!blogDetails) {
        return res.status(404).json({ error: "Blog post not found" });
      }
      const userIndex = blogDetails.likedBy.indexOf(userId);
      let color = "";
      if (userIndex > -1) {
        // User has already liked the post, so remove their like
        blogDetails.likedBy.splice(userIndex, 1);
        blogDetails.likes -= 1;
        color = "black";
      } else {
        // User has not liked the post, so add their like
        blogDetails.likedBy.push(userId);
        blogDetails.likes += 1;
        color = "red";
      }
      await blogDetails.save();
      return res.json({ likes: blogDetails.likes, color: color });
    } else {
      return res.status(401).json({ error: "Please login first" });
    }
  } catch (error) {
    console.log("Internal error", error);
    return res.status(500).render("error", {
      errorCode: 500,
      errorTitle: "Internal Server Error",
      errorMessage: "Something went wrong on our end. We are working on it!",
    });
  }
}

