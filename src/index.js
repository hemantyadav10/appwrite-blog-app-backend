import dotenv from 'dotenv'
import express from 'express'
import { v2 as cloudinary } from 'cloudinary'
import cors from 'cors';

dotenv.config({
  path: "/.env"
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.get('/health', (_req, res) => {
  res.status(200).json({ message: "All ok!!" });
})

// Route to delete an image
app.post('/delete-image', async (req, res) => {
  const { public_id } = req.body;

  if (!public_id) return res.status(400).json({ error: "Missing public_id" });

  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return res.status(200).json({ message: "Image deleted successfully", ...result });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return res.status(500).json({ error: "Failed to delete image" });
  }
});

app.listen(PORT, () => {
  console.log('💻Server running on port:', PORT)
});

export default app;