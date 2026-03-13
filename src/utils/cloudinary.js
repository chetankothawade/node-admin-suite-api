import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import logger from "./logger.js";
dotenv.config({});

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});

export const uploadMedia = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return uploadResponse;
  } catch (error) {
    logger.error({ err: error }, "Cloudinary upload error");
    throw error;
  }
};
export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    logger.error({ err: error }, "Cloudinary delete error");
    throw error;
  }
};

export const deleteVideoFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId,{resource_type:"video"});
    } catch (error) {
        logger.error({ err: error }, "Cloudinary video delete error");
        throw error;
    }
}



