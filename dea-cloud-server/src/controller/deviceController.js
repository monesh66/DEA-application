// dea-cloud-server/controllers/deviceController.js
import Device from "../model/deviceModel.js";

export const validateDevice = async (req, res) => {
  try {
    const { deviceId } = req.body;

    if (!deviceId) {
      return res.status(400).json({
        ok: false,
        reason: "DEVICE_ID_MISSING"
      });
    }

    let device = await Device.findOne({ deviceId });

    // New device → register + deny
    if (!device) {
      await Device.create({
        deviceId,
        name: "default"
      });

      return res.status(403).json({
        ok: false,
        reason: "DEVICE_NOT_AUTHORIZED"
      });
    }

    // Allowed device
    if (device.access === "allowed") {
      return res.json({ ok: true });
    }

    // Blocked / pending device
    return res.status(403).json({
      ok: false,
      reason: "DEVICE_BLOCKED"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      ok: false,
      reason: "SERVER_ERROR"
    });
  }
};
