import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";

import "./connection/connectDB.js"; // Refactored for clarity
import {
  cookieCheckHandler,
  restriction,
} from "./middleware/authentication.js";
import user from "./router/user.route.js";
import blog from "./router/blog.route.js";
import profile from "./router/profile.route.js";

//* importing admin route
import admin from "./router/admin.route.js";

// Initialize environment variables
dotenv.config();

// Create an Express application
const app = express();
const port = process.env.PORT || 3000;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.resolve("./public"))); // Serve static files

// Set up EJS view engine
app.set("view engine", "ejs");
app.set("views", path.resolve("views")); // Directory for EJS templates

// Import and use router
app.use("/", cookieCheckHandler(), user);
app.use("/admin", restriction(["admin"]), admin);
app.use("/blog", restriction(["admin", "user"]), blog);
app.use("/profile", restriction(["admin", "user"]), profile);

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start the server
app.listen(port, () => console.log(`Server is listening on port ${port}`));
