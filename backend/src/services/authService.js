const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const env = require('../config/env');
const mailer = require('../config/mailer');
const AppError = require('../utils/appError');
const { signAccessToken, signRefreshToken } = require('../utils/tokens');

const serializeUser = (user) => ({
  id: user.id,
  name: user.name,
  lastName: user.lastName,
  email: user.email,
  role: user.role?.name,
});

const sendRegistrationCode = async ({ name, lastName, email, password }) => {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new AppError('Email already registered', 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const verificationCode = `${Math.floor(100000 + Math.random() * 900000)}`;
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.pendingRegistration.upsert({
    where: { email },
    update: {
      name,
      lastName,
      passwordHash: hashedPassword,
      verificationCode,
      expiresAt,
    },
    create: {
      email,
      name,
      lastName,
      passwordHash: hashedPassword,
      verificationCode,
      expiresAt,
    },
  });

  await mailer.sendMail({
    from: env.smtp.from,
    to: email,
    subject: 'Your Himalayan Churpi verification code',
    text: `Your verification code is ${verificationCode}. It expires in 10 minutes.`,
    html: `<div style="font-family: Arial, sans-serif; line-height:1.6;">
      <h2>Verify your Himalayan Churpi account</h2>
      <p>Hello ${name},</p>
      <p>Your verification code is:</p>
      <p style="font-size:28px;font-weight:700;letter-spacing:6px;">${verificationCode}</p>
      <p>This code expires in 10 minutes.</p>
    </div>`,
  });

  return { email, message: 'Verification code sent to email' };
};

const verifyRegistrationCode = async ({ email, code }) => {
  const pendingRegistration = await prisma.pendingRegistration.findUnique({
    where: { email },
  });

  if (!pendingRegistration) {
    throw new AppError('No pending signup found for this email', 404);
  }

  if (pendingRegistration.expiresAt < new Date()) {
    throw new AppError('Verification code expired. Please request a new code.', 400);
  }

  if (pendingRegistration.verificationCode !== code) {
    throw new AppError('Invalid verification code', 400);
  }

  const userRole = await prisma.role.upsert({
    where: { name: 'USER' },
    update: {},
    create: { name: 'USER' },
  });

  const user = await prisma.user.create({
    data: {
      name: pendingRegistration.name,
      lastName: pendingRegistration.lastName,
      email: pendingRegistration.email,
      password: pendingRegistration.passwordHash,
      roleId: userRole.id,
    },
    include: { role: true },
  });

  await prisma.pendingRegistration.delete({
    where: { email },
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

  await prisma.user.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
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

module.exports = { sendRegistrationCode, verifyRegistrationCode, login, refresh, logout, getCurrentUser };
