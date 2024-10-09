import multer from 'multer'

import { fileURLToPath } from 'url';
import path from 'path'

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid name collisions
    }
});

export const upload = multer({ storage });
