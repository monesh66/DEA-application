import fetch from "node-fetch";

/**
 * Generic Cloud Gateway
 * All non-auth, non-health APIs go through here
 */
export const gateway = async (req, res) => {
    try {
        const CLOUD_URL = process.env.CLOUD_SERVER_URL;
        if (!CLOUD_URL) {
            throw new Error("CLOUD_SERVER_URL not set");
        }
        console.log("Aegawd")
        console.log(req)

        const {
            forwardURL,
            forwardMethod = "GET",
            forwardData = null
        } = req.body;

        if (!forwardURL) {
            return res.status(400).json({
                ok: false,
                error: "forwardURL is required"
            });
        }

        /* ===============================
           BUILD CLOUD REQUEST
        =============================== */
        const cloudRequest = {
            method: forwardMethod,
            headers: {
                "Content-Type": "application/json",
                // Forward auth info if needed later
                "x-forwarded-by": "dea-local-gateway"
            }
        };

        // Attach body only if method allows
        if (forwardData && !["GET", "HEAD"].includes(forwardMethod)) {
            cloudRequest.body = JSON.stringify(forwardData);
        }

        /* ===============================
           CALL CLOUD
        =============================== */
        const response = await fetch(
            `${CLOUD_URL}${forwardURL}`,
            cloudRequest
        );

        const contentType = response.headers.get("content-type");

        const data = contentType?.includes("application/json")
            ? await response.json()
            : await response.text();

        if (!response.ok) {
            return res.status(response.status).json({
                ok: false,
                cloudError: data
            });
        }

        /* ===============================
           SUCCESS
        =============================== */
        res.json({
            ok: true,
            cloud: data,
        });

    } catch (err) {
        console.error("Gateway Error:", err);
        res.status(500).json({
            ok: false,
            error: "Cloud server unreachable"
        });
    }
};
