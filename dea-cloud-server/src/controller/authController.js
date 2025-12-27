// dea-cloud-server/src/controller/authController.js

import jwt from "jsonwebtoken";
import LoginCred from "../model/loginCred.js";

/* ===============================
   LOGIN
=============================== */
export const login = async (req, res) => {
  try {
    const { userId, password, deviceId } = req.body;

    if (!userId || !password || !deviceId) {
      return res.status(400).json({
        ok: false,
        reason: "MISSING_FIELDS"
      });
    }

    const user = await LoginCred.findOne({ userId });

    if (!user || user.password !== password) {
      return res.status(401).json({
        ok: false,
        reason: "INVALID_CREDENTIALS"
      });
    }

    /* ===============================
       DEVICE RULE
    =============================== */
    if (user.device !== "any" && user.device !== deviceId) {
      return res.status(403).json({
        ok: false,
        reason: "DEVICE_MISMATCH"
      });
    }

    /* ===============================
       JWT TOKENS
    =============================== */
    const payload = {
      uid: user._id,
      userId: user.userId,
      role: user.role,
      deviceId
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRE }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    );

    res.cookie("accessToken", accessToken, {
      // httpOnly: true,
      sameSite: "lax"
    });

    res.cookie("refreshToken", refreshToken, {
      // httpOnly: true,
      sameSite: "lax"
    });

    return res.json({ ok: true });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      reason: "SERVER_ERROR"
    });
  }
};

/* ===============================
   AUTH CHECK (/auth/me)
   Used by frontend App.jsx
=============================== */
export const me = async (req, res) => {
  try {
    // authGuard already verified token + device
    return res.json({
      ok: true,
      user: {
        uid: req.user.uid,
        userId: req.user.userId,
        deviceId: req.user.deviceId
      }
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      reason: "SERVER_ERROR"
    });
  }
};
