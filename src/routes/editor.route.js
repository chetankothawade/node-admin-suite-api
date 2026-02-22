// routes/editor.route.js
import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { uploadEditor } from "../utils/multer.js";


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

      // Generate file URL 
      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/editor/${req.file.filename}`;

      return res.json({
        success: true,
        url: fileUrl, // 👈 CKEditor expects { default: "url" }, but we can handle that on frontend
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  }
);

export default router;
