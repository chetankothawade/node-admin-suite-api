import multer from 'multer';
import path from 'path';

// Use memory storage so files can be persisted through StorageManager
// (local disk or S3 based on FILESYSTEM_DISK).
const storage = multer.memoryStorage();

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
    storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export const uploadDoc = multer({
    storage,
    fileFilter: docFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

export const uploadMixed = multer({
    storage,
    fileFilter: mixedFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

export const uploadEditor = multer({
    storage,
    fileFilter: editorFilter,
    limits: { fileSize: 10 * 1024 * 1024 }
});

export const uploadChat = multer({
    storage,
    fileFilter: chatFilter,
    limits: { fileSize: 20 * 1024 * 1024 }
});

export default { uploadImage, uploadDoc, uploadMixed, uploadEditor, uploadChat };


