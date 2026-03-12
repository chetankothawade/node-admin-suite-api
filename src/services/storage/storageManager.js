import { LocalStorage } from "./local.storage.js";
import { S3Storage } from "./s3.storage.js";
import { CloudinaryStorage } from "./cloudinary.storage.js";

class StorageManager {

  constructor() {
    this.drivers = {
      local: new LocalStorage(),
      s3: new S3Storage(),
      cloudinary: new CloudinaryStorage()
    };
  }

  disk(name) {
    const driver = this.drivers[name];

    if (!driver) {
      throw new Error(`Disk [${name}] not supported`);
    }

    return driver;
  }

  getDefaultDisk() {
    return process.env.FILESYSTEM_DISK || "local";
  }

  async put(file, folder) {
    return this.disk(this.getDefaultDisk()).put(file, folder);
  }

  async putMultiple(files, folder) {
    const disk = this.disk(this.getDefaultDisk());

    const uploads = files.map(file => disk.put(file, folder));

    return Promise.all(uploads);
  }

  async delete(path) {
    return this.disk(this.getDefaultDisk()).delete(path);
  }

  async exists(path) {
    return this.disk(this.getDefaultDisk()).exists(path);
  }

  getUrl(path) {
    return this.disk(this.getDefaultDisk()).getUrl(path);
  }

  async generateSignedUrl(path, expires = 3600) {
    return this.disk(this.getDefaultDisk()).generateSignedUrl(path, expires);
  }

}

export const Storage = new StorageManager();



// Example Usage
// Upload
// await Storage.put(req.file, "chat");
// Upload multiple files
// await Storage.putMultiple(req.files, "chat");
// Delete file
// await Storage.delete(`${process.env.UPLOAD_PATH || "uploads"}/chat/2026/03/file.png`);
// Check file exists
// const exists = await Storage.exists(`${process.env.UPLOAD_PATH || "uploads"}/chat/2026/03/file.png`);
// Get public URL
// const url = Storage.getUrl(`${process.env.UPLOAD_PATH || "uploads"}/chat/2026/03/file.png`);
// Generate signed URL (S3)
// const url = await Storage.generateSignedUrl(
//   `${process.env.UPLOAD_PATH || "uploads"}/chat/2026/03/file.png`,
//   3600
// );
