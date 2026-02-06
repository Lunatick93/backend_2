import { Router } from "express";
import * as controller from "../controllers/session.controller.js";
import { authenticateLocal, getCurrent } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", controller.register);

router.post("/login", authenticateLocal, controller.login);

router.get("/current", getCurrent, controller.current);

router.post("/logout", controller.logout);

// recuperacion de contraseña
router.post("/forgot-password", controller.requestPasswordReset);
router.post("/forgot-password-sms", controller.requestPasswordResetSMS);
router.post("/reset-password", controller.resetPassword);

export default router;
