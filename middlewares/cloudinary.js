require('dotenv').config();
const cloudinary = require('cloudinary');
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

async function uploadToCloudinary(locaFilePath) {
    let mainFolderName = "main";
    let filePathOnCloudinary = mainFolderName + "/" + locaFilePath;
  
    return cloudinary.uploader.upload(locaFilePath, { public_id: filePathOnCloudinary }).then((result) => {
            fs.unlinkSync(locaFilePath);
            return {
                message: "Success",
                url: result.url,
            };
        }).catch((error) => {
            // Remove file from local uploads folder
            fs.unlinkSync(locaFilePath);
            return { message: "Fail" };
        });
}

module.exports = uploadToCloudinary;