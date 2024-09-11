import { Router } from "express";
const router = Router();

import {
    userProfileHandler,
    DashBoardHandler,
    DashBoardDataHandler,
    userProfileEditHandler,

    //** */   post update routes
    UpdateUserProfileHandler,
    PostActivityHandler,
    ShowEditPostHandler,
    UpdatePostHandler,
    DeletePostHandler,
} from "../controller/profile.controller.js";

//? profile page routes
router.get("/", userProfileHandler);

//? dashboard routes
router.get("/dashBoard", DashBoardHandler);

//? dashboard Data route
router.get("/dashBoard/Data", DashBoardDataHandler);

//? profile posts update route
router.get("/editUserProfile", userProfileEditHandler);
router.post("/user/update/:id", UpdateUserProfileHandler);
router.get("/dashBoard/activity/:id", PostActivityHandler);
router.get("/dashBoard/Data/update/:id", ShowEditPostHandler);
router.post("/dashBoard/Data/update/:id", UpdatePostHandler);
router.post("/posts/delete/:id", DeletePostHandler);

export default router;
