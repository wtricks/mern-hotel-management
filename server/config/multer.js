import multer from 'multer'

import { fileURLToPath } from 'url';
import path from 'path'
import fs from 'fs'

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        const uploadPath = path.join(__dirname, '..', 'uploads');

        // Check if the 'uploads' directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid name collisions
    }
});

export const upload = multer({ storage });
