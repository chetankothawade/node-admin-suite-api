import cloudinary from "../../config/cloudinary.js";
import { generateFilePath } from "../../utils/filePath.js";

export class CloudinaryStorage {

  async put(file, folder = "general") {

    const key = generateFilePath(file.originalname, folder);

    const result = await cloudinary.uploader.upload_stream({
      folder: folder,
      public_id: key,
      resource_type: "auto"
    });

    return new Promise((resolve, reject) => {

      const stream = cloudinary.uploader.upload_stream(
        {
          public_id: key,
          resource_type: "auto"
        },
        (error, result) => {

          if (error) return reject(error);

          resolve({
            disk: "cloudinary",
            path: result.public_id,
            url: result.secure_url
          });
        }
      );

      stream.end(file.buffer);

    });

  }

  async delete(publicId) {

    await cloudinary.uploader.destroy(publicId);

    return true;
  }

  async exists(publicId) {

    try {

      await cloudinary.api.resource(publicId);

      return true;

    } catch {
      return false;
    }

  }

  getUrl(publicId) {

    return cloudinary.url(publicId);

  }

  async generateSignedUrl(publicId, expires = 3600) {

    return cloudinary.utils.private_download_url(
      publicId,
      "auto",
      {
        expires_at: Math.floor(Date.now() / 1000) + expires
      }
    );

  }

}