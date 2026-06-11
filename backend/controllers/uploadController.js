import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Cloudinary if keys exist
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Check if Cloudinary is configured
    if (
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    ) {
      // Upload to Cloudinary using a stream
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "expense_receipts" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      return res.status(200).json({
        success: true,
        url: result.secure_url,
      });
    } else {
      // Fallback: Local upload
      const uploadsDir = path.join(__dirname, "..", "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${req.file.originalname.replace(/\s+/g, "_")}`;
      const filePath = path.join(uploadsDir, fileName);

      fs.writeFileSync(filePath, req.file.buffer);

      // Return local server URL
      const localUrl = `http://localhost:${process.env.PORT || 8000}/uploads/${fileName}`;
      return res.status(200).json({
        success: true,
        url: localUrl,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export default uploadFile;
