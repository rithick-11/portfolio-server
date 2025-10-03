import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Path to the file or base64 string
 * @param {object} options - Upload options
 * @returns {Promise<object>} - Upload result with URL and public_id
 */
const uploadToCloudinary = async (filePath, options = {}) => {
  try {
    const defaultOptions = {
      folder: "projects", // Cloudinary folder name
      resource_type: "auto", // Automatically detect file type
      ...options,
    };

    const result = await cloudinary.uploader.upload(filePath, defaultOptions);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
    };
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error(`Failed to upload image: ${error.message}`);
  }
};

/**
 * Upload multiple images to Cloudinary
 * @param {array} files - Array of file paths or base64 strings
 * @param {object} options - Upload options
 * @returns {Promise<array>} - Array of upload results
 */
const uploadMultipleToCloudinary = async (files, options = {}) => {
  try {
    const uploadPromises = files.map((file) =>
      uploadToCloudinary(file, options)
    );
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error("Multiple Upload Error:", error);
    throw new Error(`Failed to upload images: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of the image to delete
 * @returns {Promise<object>} - Deletion result
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === "ok",
      message:
        result.result === "ok"
          ? "Image deleted successfully"
          : "Image not found",
    };
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw new Error(`Failed to delete image: ${error.message}`);
  }
};

/**
 * Upload base64 image to Cloudinary
 * @param {string} base64String - Base64 encoded image string
 * @param {object} options - Upload options
 * @returns {Promise<object>} - Upload result
 */
const uploadBase64ToCloudinary = async (base64String, options = {}) => {
  try {
    // Cloudinary accepts base64 strings directly
    return await uploadToCloudinary(base64String, options);
  } catch (error) {
    console.error("Base64 Upload Error:", error);
    throw new Error(`Failed to upload base64 image: ${error.message}`);
  }
};

/**
 * Replace/Update existing image on Cloudinary
 * @param {string} oldPublicId - Public ID of image to replace
 * @param {string} newFilePath - New file path or base64 string
 * @param {object} options - Upload options
 * @returns {Promise<object>} - Upload result
 */
const replaceImageOnCloudinary = async (
  oldPublicId,
  newFilePath,
  options = {}
) => {
  try {
    // Delete old image
    if (oldPublicId) {
      await deleteFromCloudinary(oldPublicId);
    }

    // Upload new image
    const result = await uploadToCloudinary(newFilePath, options);
    return result;
  } catch (error) {
    console.error("Replace Image Error:", error);
    throw new Error(`Failed to replace image: ${error.message}`);
  }
};

export {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
  uploadBase64ToCloudinary,
  replaceImageOnCloudinary,
  cloudinary,
};
