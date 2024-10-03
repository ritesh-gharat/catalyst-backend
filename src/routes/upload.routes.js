import express from "express";
import upload from "../middleware/multer.middleware.js";

const uploadRoutes = express.Router();

uploadRoutes.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const localFilePath = req.file.path;
    res.json({ origin: req.file.filename, type: req.file.mimetype });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

export default uploadRoutes;