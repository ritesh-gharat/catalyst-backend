import express from "express";
import { signup, login, logout } from "../controllers/auth.controllers.js";

const router = express.Router();

// the signup routes
router.post("/signup", signup);
// the login routes
router.post("/login", login);
// the logout routes
router.post("/logout", logout);

export default router;