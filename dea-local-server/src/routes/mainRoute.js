// dea-local-server/routes/mainRoute.js
import { Router } from "express";
import { localHealth, cloudHealth } from "../controller/healthController.js";
import {
   deviceAuthCheck,
   login,
   me,
   refresh,
   logout
} from "../controller/authController.js";
import { ocrStatus } from "../controller/ocrController.js";
import { testGet } from "../controller/testController.js";
import { gateway } from "../controller/gatewayController.js";
import { upload } from "../middleware/fileStorageMiddleware.js";
import { createBundle } from "../controller/addBundleController.js";

const router = Router();

router.get("/test/get", testGet);

/* ===============================
   HEALTH
=============================== */
router.get("/health/local", localHealth);
router.get("/health/cloud", cloudHealth);

/* ===============================
   AUTH
=============================== */
router.get("/auth/device", deviceAuthCheck);   // precheck
router.post("/auth/login", login);             // login
router.get("/auth/me", me);                    // accessToken verify
router.post("/auth/refresh", refresh);         // refresh accessToken
router.post("/auth/logout", logout);           // clear cookies

/* ===============================
   ADD BUNDLE
=============================== */
router.post(
  "/addbundle/createbundle",
  upload.array("files"),
  createBundle
);


router.use("/gateway", gateway);

/* ===============================
   OCR
=============================== */
router.get("/ocr/status", ocrStatus);

export default router;
