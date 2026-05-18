const catchAsync = require('../utils/catchAsync');
const mediaService = require('../services/mediaService');

const upload = catchAsync(async (req, res) => {
  const data = await mediaService.uploadMedia(req.file);
  res.status(201).json({ success: true, data });
});

module.exports = { upload };
