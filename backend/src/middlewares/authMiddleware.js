const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const env = require('../config/env');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const protect = catchAsync(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    throw new AppError('Authentication required', 401);
  }

  const token = authHeader.split(' ')[1];
  const decoded = jwt.verify(token, env.jwtSecret);
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    include: { role: true },
  });

  if (!user || user.deletedAt) {
    throw new AppError('User no longer exists', 401);
  }

  req.user = user;
  next();
});

const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role?.name)) {
    return next(new AppError('You do not have access to this resource', 403));
  }
  next();
};

module.exports = { protect, authorize };
