const cloudinary = require('cloudinary');
const fs = require('fs');

cloudinary.config({
    cloud_name: 'dxm8cacex',
    api_key: 556995464666113,
    api_secret: 'uG92SaaRjhRRBu7Bjzd7FVCgE0Y',
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