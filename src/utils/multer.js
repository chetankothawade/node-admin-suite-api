import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure upload directories exist
['uploads/images', 'uploads/docs', 'uploads/editor', 'uploads/chat'].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Common storage function
const storage = (folder) => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Image file filter
const imageFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = file.mimetype.startsWith('image/');
    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

// Document file filter
const docFilter = (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ].includes(file.mimetype);
    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF or DOC files are allowed'));
    }
};

// Mixed file filter (images + docs)
const mixedFilter = (req, file, cb) => {
    const imageTypes = /jpeg|jpg|png|gif/;
    const docTypes = /pdf|doc|docx/;
    const extName = path.extname(file.originalname).toLowerCase().substring(1); // remove dot
    if (imageTypes.test(extName) || docTypes.test(extName)) {
        cb(null, true);
    } else {
        cb(new Error('Only image or document files are allowed'));
    }
};

// Editor file filter
const editorFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = file.mimetype.startsWith('image/');
    if (extName && mimeType) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed'));
    }
};

// Chat file filter (allow any type)
const chatFilter = (req, file, cb) => {
    cb(null, true); // accept all
};

// Uploaders
export const uploadImage = multer({
    storage: storage('uploads/images'),
    fileFilter: imageFilter,
    limits: { file_size: 5 * 1024 * 1024 }
});

export const uploadDoc = multer({
    storage: storage('uploads/docs'),
    fileFilter: docFilter,
    limits: { file_size: 10 * 1024 * 1024 }
});

export const uploadMixed = multer({
    storage: storage('uploads'),
    fileFilter: mixedFilter,
    limits: { file_size: 10 * 1024 * 1024 }
});

export const uploadEditor = multer({
    storage: storage('uploads/editor'),
    fileFilter: editorFilter,
    limits: { file_size: 10 * 1024 * 1024 }
});

export const uploadChat = multer({
    storage: storage('uploads/chat'),
    fileFilter: chatFilter,
    limits: { file_size: 20 * 1024 * 1024 }
});

export default { uploadImage, uploadDoc, uploadMixed, uploadEditor, uploadChat };


