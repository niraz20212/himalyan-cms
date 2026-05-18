const fs = require('fs');
const path = require('path');
const cloudinary = require('../config/cloudinary');
const prisma = require('../config/db');
const env = require('../config/env');
const AppError = require('../utils/appError');
const { randomUUID } = require('crypto');
const { serializeMedia } = require('../utils/media');

const uploadMedia = async (file) => {
  if (!file) {
    throw new AppError('File is required', 400);
  }

  if (env.cloudinary.enabled) {
    const uploaded = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: 'himalayan-churpi' }, (error, result) => {
          if (error) return reject(error);
          return resolve(result);
        })
        .end(file.buffer);
    });

    const media = await prisma.media.create({
      data: {
        name: file.originalname,
        url: uploaded.secure_url,
        publicId: uploaded.public_id,
        mimeType: file.mimetype,
        size: file.size,
        altText: file.originalname,
      },
    });
    return serializeMedia(media);
  }

  const uploadsDir = path.resolve(__dirname, '..', '..', 'uploads');
  fs.mkdirSync(uploadsDir, { recursive: true });

  const extension = path.extname(file.originalname) || '.bin';
  const fileName = `${randomUUID()}${extension}`;
  const filePath = path.join(uploadsDir, fileName);
  fs.writeFileSync(filePath, file.buffer);

  const media = await prisma.media.create({
    data: {
      name: file.originalname,
      url: `/uploads/${fileName}`,
      publicId: fileName,
      mimeType: file.mimetype,
      size: file.size,
      altText: file.originalname,
    },
  });
  return serializeMedia(media);
};

module.exports = { uploadMedia };
