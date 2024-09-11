import person from "../model/user.model.js";
import blog from "../model/blog.model.js";
import comment from "../model/comment.model.js";
// ? user profile handler
export async function userProfileHandler(req, res) {
  try {
    const email = req.user.email;
    const userProfile = await person.findOne({ email: email });

    if (!userProfile) {
      return res.redirect("/login");
    }
    res.render("profile", { userData: userProfile });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res.status(500).render("error", {
      errorCode: 500,
      errorTitle: "Internal Server Error",
      errorMessage: "Something went wrong on our end. We are working on it!",
    });
  }
}

export async function userProfileEditHandler(req, res) {
    try {
    const user = await person.findById(req.user.id);
    if (!user) {
      return res.status(404).render("error", {
        errorCode: 404,
        errorTitle: "Page Not Found",
        errorMessage: "user not found.",
      });
    }
    res.render("userProfileEdit", { userData: user });
} catch (error) {
    console.error(error);
    return res.status(500).render("error", {
      errorCode: 500,
      errorTitle: "Internal Server Error",
      errorMessage: "Something went wrong on our end. We are working on it!",
    });
}
}

export async function UpdateUserProfileHandler(req, res) {
  try {
    const userId = req.params.id;
    const { fullName, email, bio, address, socialMedia } = req.body;

    // Find the user and update their profile
    const user = await person.findById(userId);
    if (!user) {
      return res.status(404).render("error", {
        errorCode: 404,
        errorTitle: "Page Not Found",
        errorMessage: "user not found.",
      });
    }

    const updateData = {
      FullName: fullName,
      email: email,
    };

    // Hash the password if it's provided
    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      updateData.password = hashedPassword;
    }

    // Find the user by ID and update
    const updatedUser = await person.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    await blog.updateMany(
      { email: req.user.email }, // Filter: find documents by current email
      { $set: { email: email } } // Update: set new email
    );

    if (!updatedUser) {
      // Handle user not found case
      return res.status(404).render("error", {
        errorCode: 404,
        errorTitle: "Page Not Found",
        errorMessage: "user not found.",
      });
    }
    res.clearCookie("token");
    res.redirect("/login");
  } catch (error) {
    console.error(error);
    return res.status(500).render("error", {
      errorCode: 500,
      errorTitle: "Internal Server Error",
      errorMessage: "Something went wrong on our end. We are working on it!",
    });
  }
}

export async function DashBoardHandler(req, res) {
    try {
        if (req.user) {
            const AllPostsData = await blog.find({
                email: req.user.email
            })

            res.render('allotsActivity', { posts: AllPostsData });
        }
        else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).render('error', {
            errorCode: 500,
            errorTitle: 'Internal Server Error',
            errorMessage: 'Something went wrong on our end. We are working on it!',
        });
    }

}
export async function DashBoardDataHandler(req, res) {
    try {
        if (req.user) {
            const email = req.user.email
            const userProfile = await person.findOne({ email: email });
            const PostComment = await comment.find({
                email_to: req.user.email
            });

            if (!userProfile) {
                return res.redirect('/login');
            }
            const UserPosts = await blog.find({ email: userProfile.email });
            if (!UserPosts) {
                return res.status(404).render('error', {
                    errorCode: 404,
                    errorTitle: 'Page Not Found',
                    errorMessage: 'no post found for this user.',
                });
            }
            res.render('allActivity', { userData: userProfile, posts: UserPosts, comment: PostComment });
        }
        else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return res.status(500).render('error', {
            errorCode: 500,
            errorTitle: 'Internal Server Error',
            errorMessage: 'Something went wrong on our end. We are working on it!',
        });
    }
}

export async function PostActivityHandler(req, res) {
  try {
    const id = req.params.id;
    const PostData = await blog.findById(id);
    if (!PostData) {
      return res.status(404).render("error", {
        errorCode: 404,
        errorTitle: "Page Not Found",
        errorMessage: "post not found.",
      });
    }
    const PostComment = await comment.find({
      post_id: req.params.id,
    });
    const PostActivityData = {
      id: PostData._id,
      title: PostData.title,
      author: PostData.author,
      likes: PostData.likes,
      Views: PostData.Views,
      PostComments: PostComment,
    };

    res.render("activity", { userPosts: PostActivityData });
  } catch (error) {
    console.log(error);
    return res.status(500).render("error", {
      errorCode: 500,
      errorTitle: "Internal Server Error",
      errorMessage: "Something went wrong on our end. We are working on it!",
    });
  }
}

// ! UserPosts edit handler
export async function ShowEditPostHandler(req, res) {
  try {
    const postId = req.params.id;
    const post = await blog.findById(postId);
    if (!post) {
      return res.status(404).render("error", {
        errorCode: 404,
        errorTitle: "Page Not Found",
        errorMessage: "posts not found.",
      });
    }
    res.render("editPost", { post });
  } catch (err) {
    return res.status(500).render("error", {
      errorCode: 500,
      errorTitle: "Internal Server Error",
      errorMessage: "Something went wrong on our end. We are working on it!",
    });
  }
}

//! Update the post
export async function UpdatePostHandler(req, res) {
  try {
    const postId = req.params.id;
    const { title, content, visibility } = req.body;

    const post = await blog.findByIdAndUpdate(
      postId,
      { title, content, visibility },
      { new: true }
    );
    if (!post) {
      return res.status(404).render("error", {
        errorCode: 404,
        errorTitle: "Page Not Found",
        errorMessage: "posts not found.",
      });
    }

    res.redirect(`/blog/${post._id}`); // Redirect to the updated post
  } catch (err) {
    return res.status(500).render("error", {
      errorCode: 500,
      errorTitle: "Internal Server Error",
      errorMessage: "Something went wrong on our end. We are working on it!",
    });
  }
}

//! Delete the post route

export async function DeletePostHandler(req, res) {
  try {
    const postId = req.params.id;

    const post = await blog.findByIdAndDelete(postId);
    if (!post) {
      return res.status(404).render("error", {
        errorCode: 404,
        errorTitle: "Page Not Found",
        errorMessage: "posts not found.",
      });
    }

    res.redirect("/profile"); // Redirect to the dashboard after deleting the post
  } catch (err) {
    return res.status(500).render("error", {
      errorCode: 500,
      errorTitle: "Internal Server Error",
      errorMessage: "Something went wrong on our end. We are working on it!",
    });
  }
}

