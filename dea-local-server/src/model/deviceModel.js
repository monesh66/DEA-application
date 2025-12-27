import os from "os";
import crypto from "crypto";

export const getDeviceFingerprint = () => {
    const data = [
        os.hostname(),
        os.platform(),
        os.arch(),
        os.cpus().length
    ].join("|");

    return crypto
        .createHash("sha256")
        .update(data)
        .digest("hex");
};
