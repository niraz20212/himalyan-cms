const cloudinary = require('../config/cloudinary');
const prisma = require('../config/db');
const AppError = require('../utils/appError');

const uploadMedia = async (file) => {
  if (!file) {
    throw new AppError('File is required', 400);
  }

  const uploaded = await new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: 'himalayan-churpi' }, (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      })
      .end(file.buffer);
  });

  return prisma.media.create({
    data: {
      name: file.originalname,
      url: uploaded.secure_url,
      publicId: uploaded.public_id,
      mimeType: file.mimetype,
      size: file.size,
      altText: file.originalname,
    },
  });
};

module.exports = { uploadMedia };
