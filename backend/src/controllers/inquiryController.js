const prisma = require('../config/db');
const catchAsync = require('../utils/catchAsync');

const createInquiry = catchAsync(async (req, res) => {
  const data = await prisma.inquiry.create({ data: req.body });
  res.status(201).json({ success: true, data });
});

module.exports = { createInquiry };
