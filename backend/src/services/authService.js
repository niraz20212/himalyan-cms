const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const env = require('../config/env');
const AppError = require('../utils/appError');
const { signAccessToken, signRefreshToken } = require('../utils/tokens');

const serializeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  role: user.role?.name,
});

const register = async ({ name, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const userRole = await prisma.role.findUnique({ where: { name: 'USER' } });
  if (!userRole) {
    throw new AppError('Default USER role is not configured', 500);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      roleId: userRole.id,
    },
    include: { role: true },
  });

  const payload = { id: user.id, role: user.role.name };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return { user: serializeUser(user), accessToken, refreshToken };
};

const login = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  });

  if (!user || !user.isActive) {
    throw new AppError('Invalid credentials', 401);
  }

  const matches = await bcrypt.compare(password, user.password);
  if (!matches) {
    throw new AppError('Invalid credentials', 401);
  }

  const payload = { id: user.id, role: user.role.name };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return { user: serializeUser(user), accessToken, refreshToken };
};

const refresh = async (token) => {
  const existingToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: { include: { role: true } } },
  });

  if (!existingToken || existingToken.revokedAt || existingToken.expiresAt < new Date()) {
    throw new AppError('Invalid refresh token', 401);
  }

  const decoded = jwt.verify(token, env.jwtRefreshSecret);
  const payload = { id: decoded.id, role: decoded.role };
  const nextRefreshToken = signRefreshToken(payload);

  await prisma.refreshToken.update({
    where: { token },
    data: {
      revokedAt: new Date(),
    },
  });

  await prisma.refreshToken.create({
    data: {
      token: nextRefreshToken,
      userId: existingToken.user.id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken: signAccessToken(payload),
    refreshToken: nextRefreshToken,
    user: serializeUser(existingToken.user),
  };
};

const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Refresh token is required', 400);
  }

  await prisma.refreshToken.updateMany({
    where: { token: refreshToken, revokedAt: null },
    data: { revokedAt: new Date() },
  });

  return { message: 'Logged out successfully' };
};

const getCurrentUser = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { role: true },
  });

  if (!user || user.deletedAt) {
    throw new AppError('User not found', 404);
  }

  return serializeUser(user);
};

module.exports = { register, login, refresh, logout, getCurrentUser };
