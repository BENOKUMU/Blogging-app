import axios from "axios";

export const uploadImage = async (img, access_token) => {
  try {
    const formData = new FormData();
    formData.append("file", img);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    ); // Vite environment variables
    formData.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);

    // Debugging logs
    console.log(
      "Cloudinary Upload Preset:",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );
    console.log(
      "Cloudinary Cloud Name:",
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    );
    console.log("FormData Contents:", [...formData.entries()]);

    // Cloudinary Upload URL
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${
      import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`;

    // Axios POST request to Cloudinary
    const response = await axios.post(cloudinaryUrl, formData, {
      headers: {
        // Authorization: access_token ? `Bearer ${access_token}` : undefined, // Optional, only if access_token is provided
        "Content-Type": "multipart/form-data",
      },
    });

    // Extract the secure URL
    return response.data.secure_url;
  } catch (error) {
    // Enhanced error logging
    console.error(
      "Error uploading image to Cloudinary:",
      error.response?.data || error.message
    );
    return null;
  }
};
