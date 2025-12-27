// dea-cloud-server/routes/mainRoute.js

import { Router } from "express";

import { cloudHealth } from "../controller/healthController.js";
import { validateDevice } from "../controller/deviceController.js";
import { login, me } from "../controller/authController.js";
import { refreshToken } from "../controller/tokenController.js";
import { authGuard } from "../middleware/authGuard.js";
import { getMemberList, saveBundle } from "../controller/addBundleController.js";

const router = Router();

/* ===============================
   PUBLIC ROUTES (NO AUTH)
================================ */

// Cloud health check
router.get("/health", cloudHealth);

// Device validation
router.post("/device/validate", validateDevice);

// Login
router.post("/auth/login", login);

// Refresh access token
router.post("/auth/refresh", refreshToken);

/* ===============================
   PROTECTED ROUTES
================================ */

// Validate session / get user
router.get("/auth/me", authGuard, me);

// add bundle
router.get("/addbundle/memberlist", getMemberList)
router.post("/addbundle/savebundle", saveBundle)

export default router;
