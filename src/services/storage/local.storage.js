import fs from "fs";
import path from "path";
import { generateFilePath } from "../../utils/filePath.js";

export class LocalStorage {

  async put(file, folder = "general") {

    const relativePath = generateFilePath(file.originalname, folder);

    const fullPath = path.join(process.cwd(), relativePath);

    const dir = path.dirname(fullPath);

    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(fullPath, file.buffer);

    return {
      disk: "local",
      path: relativePath,
      url: this.getUrl(relativePath)
    };
  }

  async delete(filePath) {

    const fullPath = path.join(process.cwd(), filePath);

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    return true;
  }

  async exists(filePath) {

    const fullPath = path.join(process.cwd(), filePath);

    return fs.existsSync(fullPath);
  }

  getUrl(filePath) {
    return `/${filePath}`;
  }

  async generateSignedUrl(filePath) {

    // Local doesn't need signed URL
    return this.getUrl(filePath);
  }

}