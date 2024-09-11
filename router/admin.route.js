import { Router } from "express";
const router = Router();
// !admin route, only admin can access this route

import {
  AdminHandler,
  UserEditHandler,
  UserDeleteHandler,
  UserUpdateHandler,
  settingsHandler,
} from "../controller/admin.controller.js";

// Admin routes with authentication and role-based access control
router.get('/', AdminHandler);
router.route('/edit/:id').get(UserEditHandler).post(UserUpdateHandler);
router.get('/delete/:id', UserDeleteHandler);
router.get('/settings', settingsHandler);

export default router;
