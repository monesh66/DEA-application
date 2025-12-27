// dea-local-server/fileStorageMiddleware.js
import fs from "fs";
import path from "path";
import multer from "multer";



const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const BASE_PATH = process.env.SAVED_BUNDLES_PATH;
        const TEMP_PATH = path.join(BASE_PATH, "temp");
        if (!req._tempReady) {
            if (fs.existsSync(TEMP_PATH)) {
                fs.rmSync(TEMP_PATH, { recursive: true, force: true });
            }

            fs.mkdirSync(TEMP_PATH, { recursive: true });
            req._tempReady = true;
            req._tempPath = TEMP_PATH;
        }

        cb(null, TEMP_PATH);
    },

    filename: (req, file, cb) => {
        // keep original filename so later rename works
        cb(null, file.originalname);
    }
});



export const upload = multer({ storage });
