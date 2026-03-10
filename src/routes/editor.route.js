// routes/editor.route.js
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { uploadEditor } from "../utils/multer.js";
import { Storage } from "../services/storage/storageManager.js";

const router = express.Router();

router.post(
  "/upload",
  isAuthenticated,
  uploadEditor.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }

      const uploaded = await Storage.put(req.file, "editor");
      const fileUrl = uploaded.url.startsWith("http")
        ? uploaded.url
        : `${req.protocol}://${req.get("host")}${uploaded.url}`;

      return res.json({
        success: true,
        url: fileUrl,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

export default router;
