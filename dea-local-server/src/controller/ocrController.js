import { exec } from "child_process";

export const ocrStatus = async (req, res) => {
    exec("tesseract --version", (error, stdout) => {
        if (error) {
            return res.status(500).json({
                ok: false,
                installed: false
            });
        }

        return res.json({
            ok: true,
            installed: true,
            version: stdout.split("\n")[0]
        });
    });
};
