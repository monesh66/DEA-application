// dea-local-server/controllers/authController.js
import fetch from "node-fetch";
import jwt from "jsonwebtoken";
import { getDeviceFingerprint } from "../model/deviceModel.js";

/* ===============================
   DEVICE PRECHECK (NO JWT)
=============================== */
export const deviceAuthCheck = async (req, res) => {
  try {
    const deviceId = getDeviceFingerprint();

    const cloudRes = await fetch(
      `${process.env.CLOUD_SERVER_URL}/device/validate`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId })
      }
    );

    const data = await cloudRes.json();
    return res.status(cloudRes.status).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      reason: "CLOUD_UNREACHABLE"
    });
  }
};

/* ===============================
   LOGIN → CLOUD
=============================== */
export const login = async (req, res) => {
  try {
    const deviceId = getDeviceFingerprint();

    const cloudRes = await fetch(
      `${process.env.CLOUD_SERVER_URL}/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...req.body,
          deviceId
        })
      }
    );

    const data = await cloudRes.json();

    // 🔁 Forward cookies
    const setCookie = cloudRes.headers.raw()["set-cookie"];
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    return res.status(cloudRes.status).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      reason: "CLOUD_UNREACHABLE"
    });
  }
};

/* ===============================
   AUTH CHECK (accessToken)
=============================== */
export const me = (req, res) => {
  try {
    console.log("Cookies:", req.cookies);

    const token = req.cookies?.accessToken;
    if (!token) {
      return res.status(401).json({
        ok: false,
        reason: "NO_ACCESS_TOKEN"
      });
    }

    jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ ok: true });

  } catch (err) {
    console.error("auth/me ERROR:", err);
    return res.status(401).json({
      ok: false,
      reason: "INVALID_ACCESS_TOKEN"
    });
  }
};

/* ===============================
   REFRESH TOKEN
=============================== */
export const refresh = async (req, res) => {
  try {
    const cloudRes = await fetch(
      `${process.env.CLOUD_SERVER_URL}/auth/refresh`,
      {
        method: "POST",
        headers: {
          Cookie: req.headers.cookie || ""
        }
      }
    );

    const data = await cloudRes.json();

    const setCookie = cloudRes.headers.raw()["set-cookie"];
    if (setCookie) {
      res.setHeader("Set-Cookie", setCookie);
    }

    return res.status(cloudRes.status).json(data);

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      reason: "CLOUD_UNREACHABLE"
    });
  }
};

/* ===============================
   LOGOUT
=============================== */
export const logout = (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  return res.json({ ok: true });
};
