const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (file) => {
    try {
        if (!file) return null;

        // If it's a base64 string or data URI
        if (typeof file === 'string' && file.startsWith('data:')) {
            const result = await cloudinary.uploader.upload(file, {
                folder: 'ecommerce/products',
                resource_type: 'auto'
            });
            return result.secure_url;
        }

        // If it's already a URL, return it as is
        if (typeof file === 'string') {
            return file;
        }

        // If it's a file buffer
        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                { folder: 'ecommerce/products' },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result.secure_url);
                }
            );
            stream.end(file.buffer);
        });
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
};

module.exports = { uploadToCloudinary };
