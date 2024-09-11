import { Router } from "express";
const router = Router();
// ** signIn signUP routes
// ! home page router

import {
    ShowHomeHandler,
    RegisterUserHandler,
    LoginUserHandler,
    RegisterPersonHandler,
    LoginPersonHandler,
    LogOutHandler,
} from "../controller/user.controller.js";
router.get("/", ShowHomeHandler);
router.get("/register", RegisterUserHandler);
router.post("/register", RegisterPersonHandler);
router.get("/login", LoginUserHandler);
router.post("/login", LoginPersonHandler);
router.get("/logout", LogOutHandler);




export default router;
