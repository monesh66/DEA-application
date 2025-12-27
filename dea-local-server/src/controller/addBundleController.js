import fs from "fs";
import path from "path";
import fetch from "node-fetch";

export const createBundle = async (req, res) => {
  const { bundleName, deadLine, members } = req.body;
  const basePath = process.env.SAVED_BUNDLES_PATH;

  if (!bundleName) {
    cleanupTemp(req._tempPath);
    return res.status(400).json({ ok: false, error: "Bundle name missing" });
  }

  const finalPath = path.join(basePath, bundleName);

  if (fs.existsSync(finalPath)) {
    cleanupTemp(req._tempPath);
    return res.status(409).json({ ok: false, error: "Bundle already exists" });
  }

  fs.mkdirSync(finalPath, { recursive: true });

  try {
    // Move files from temp → final folder
    const filesList = [];
    for (const file of req.files) {
      const src = path.join(req._tempPath, file.originalname);
      const dest = path.join(finalPath, file.originalname);
      fs.renameSync(src, dest);
      filesList.push(file.originalname);
    }

    fs.rmSync(req._tempPath, { recursive: true, force: true });


    // Prepare metadata object
    const bundleMetadata = {
      bundleName,
      totalFiles: filesList.length,
      filesList,
      deadline: new Date(deadLine),
      members: Array.isArray(members) ? members : [members],
      totalCompleted: 0,
    };

    // Send to cloud DB
    const CLOUD_BASE_URL = process.env.CLOUD_API_BASE_URL;

    const response = await fetch(
      `${CLOUD_BASE_URL}/addbundle/createbundle`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // optional auth header
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(bundleMetadata)
      }
    );
    console.log("aoenoenan")
    console.log(response)



    return res.json({ ok: true, message: "Bundle created successfully", bundle: bundleMetadata });
  } catch (err) {
    console.error(err);
    cleanupTemp(req._tempPath);
    return res.status(500).json({ ok: false, error: "Bundle creation failed" });
  }
};

function cleanupTemp(tempPath) {
  if (tempPath && fs.existsSync(tempPath)) {
    fs.rmSync(tempPath, { recursive: true, force: true });
  }
}
