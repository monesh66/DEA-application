// dea-cloud-server/middlewares/authGuard.js
import jwt from "jsonwebtoken";

export const authGuard = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    const deviceId = req.body.deviceId || req.headers["x-device-id"];

    if (!token || !deviceId) {
      return res.status(401).json({
        ok: false,
        reason: "AUTH_REQUIRED"
      });
    }

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (payload.deviceId !== deviceId) {
      return res.status(403).json({
        ok: false,
        reason: "DEVICE_MISMATCH"
      });
    }

    req.user = payload;
    next();

  } catch (err) {
    return res.status(401).json({
      ok: false,
      reason: "TOKEN_EXPIRED"
    });
  }
};
