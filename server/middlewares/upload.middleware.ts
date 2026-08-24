import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_DIR, UPLOAD_MAX_SIZE, ALLOWED_IMAGE_TYPES } from '../utils/constants';

// Ensure upload directories exist
const ensureDir = (dir: string) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

ensureDir(path.join(process.cwd(), UPLOAD_DIR, 'images'));
ensureDir(path.join(process.cwd(), UPLOAD_DIR, 'documents'));
ensureDir(path.join(process.cwd(), UPLOAD_DIR, 'media'));

const storage = multer.diskStorage({
  destination: (_req, file, cb) => {
    let folder = 'media';
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      folder = 'images';
    } else if (file.mimetype.includes('pdf') || file.mimetype.includes('document')) {
      folder = 'documents';
    }
    const dest = path.join(process.cwd(), UPLOAD_DIR, folder);
    ensureDir(dest);
    cb(null, dest);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${uuidv4()}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (_req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = [
    ...ALLOWED_IMAGE_TYPES,
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'audio/mpeg',
    'audio/wav',
    'audio/ogg',
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} is not allowed`));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: UPLOAD_MAX_SIZE },
});

export const uploadSingle = upload.single('file');
export const uploadMultiple = upload.array('files', 10);
export const uploadFields = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'images', maxCount: 10 },
  { name: 'document', maxCount: 1 },
  { name: 'audio', maxCount: 1 },
]);
