import fetch from "node-fetch";

export const localHealth = (req, res) => {
    res.json({ ok: true });
};

export const cloudHealth = async (req, res) => {
    try {
        const CLOUD_URL = process.env.CLOUD_SERVER_URL;

        if (!CLOUD_URL) {
            throw new Error("CLOUD_SERVER_URL not set");
        }

        const response = await fetch(`${CLOUD_URL}/health`);
        const data = await response.json();

        if (!response.ok) throw new Error();

        res.json({
            ok: true,
            cloud: data
        });

    } catch (err) {
        res.status(500).json({
            ok: false,
            error: "Cloud server unreachable"
        });
    }
};
