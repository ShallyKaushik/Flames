import fs from "fs";
import cloudinary from "../config/cloudinary.js";

const uploadOnCloudinary = async (localFilePath) => {

    try {

        if (!localFilePath) return null;

        const response = await cloudinary.uploader.upload(
            localFilePath,
            {
                folder: "flames/posts",
            }
        );

        fs.unlinkSync(localFilePath);

        return response.secure_url;

    } catch (error) {

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        throw error;
    }

};

export default uploadOnCloudinary;