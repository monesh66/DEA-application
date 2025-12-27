// dea-cloud-server/controllers/tokenController.js
import jwt from "jsonwebtoken";

export const refreshToken = (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        ok: false,
        reason: "NO_REFRESH_TOKEN"
      });
    }

    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET
    );

    const newAccessToken = jwt.sign(
      {
        uid: payload.uid,
        userId: payload.userId,
        deviceId: payload.deviceId,
        role: payload.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRE }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      sameSite: "lax"
    });

    return res.json({ ok: true });

  } catch (err) {
    return res.status(401).json({
      ok: false,
      reason: "INVALID_REFRESH_TOKEN"
    });
  }
};
