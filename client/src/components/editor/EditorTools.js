import Embed from "@editorjs/embed";
import List from "@editorjs/list";
import Image from "@editorjs/image";
import Header from "@editorjs/header";
import Quote from "@editorjs/quote";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";

import axios from "axios";

// Upload an image by URL
const uploadImageByUrl = async (imgUrl) => {
    try {
        const formData = new FormData();
        formData.append("file", imgUrl);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

        const response = await axios.post(cloudinaryUrl, formData);
        return {
            success: 1,
            file: { url: response.data.secure_url }, // Return Cloudinary URL
        };
    } catch (error) {
        console.error("Error uploading image by URL to Cloudinary:", error);
        return {
            success: 0,
            error: error.message,
        };
    }
};

// Upload an image by file
const uploadImageByFile = async (img) => {
    try {
        const formData = new FormData();
        formData.append("file", img);
        formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

        const response = await axios.post(cloudinaryUrl, formData);
        return {
            success: 1,
            file: { url: response.data.secure_url }, // Return Cloudinary URL
        };
    } catch (error) {
        console.error("Error uploading image file to Cloudinary:", error);
        return {
            success: 0,
            error: error.message,
        };
    }
};

// Editor.js tools configuration
export const tools = {
    embed: Embed,
    list: {
        class: List,
        inlineToolbar: true,
    },
    image: {
        class: Image,
        config: {
            uploader: {
                uploadByUrl: uploadImageByUrl,
                uploadByFile: uploadImageByFile,
            },
        },
    },
    header: {
        class: Header,
        config: {
            placeholder: "Type heading...",
            levels: [2, 3],
            defaultLevel: 2,
        },
    },
    quote: {
        class: Quote,
        inlineToolbar: true,
    },
    marker: Marker,
    inlineCode: InlineCode,
};
