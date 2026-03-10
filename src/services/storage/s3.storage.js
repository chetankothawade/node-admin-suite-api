import { 
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
  GetObjectCommand
} from "@aws-sdk/client-s3";

import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import s3 from "../../config/s3.js";
import { generateFilePath } from "../../utils/filePath.js";

export class S3Storage {

  async put(file, folder = "general") {

    const key = generateFilePath(file.originalname, folder);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype
    });

    await s3.send(command);

    return {
      disk: "s3",
      path: key,
      url: this.getUrl(key)
    };
  }

  async delete(key) {

    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key
    });

    await s3.send(command);

    return true;
  }

  async exists(key) {

    try {

      const command = new HeadObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: key
      });

      await s3.send(command);

      return true;

    } catch {
      return false;
    }
  }

  getUrl(key) {
    return `https://${process.env.AWS_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

  async generateSignedUrl(key, expires = 3600) {

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: key
    });

    return getSignedUrl(s3, command, { expiresIn: expires });
  }

}