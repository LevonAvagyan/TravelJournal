import axios from "axios";

const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY;

export const uploadToImgBB = async (file) => {
  if (!IMGBB_API_KEY) {
    throw new Error("API key not configured in .env");
  }

  if (file.size > 32 * 1024 * 1024) {
    throw new Error("File too large (max 32MB)");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Please select a valid image file");
  }

  const formData = new FormData();
  formData.append("key", IMGBB_API_KEY);
  formData.append("image", file);
  formData.append("expiration", "0");

  try {
    const res = await axios.post("https://api.imgbb.com/1/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.data.success) {
      return res.data.data.url;
    } else {
      throw new Error(res.data.error?.message || "Upload failed");
    }
  } catch (error) {
    console.error("ImgBB upload error:", error);
    throw error;
  }
};
