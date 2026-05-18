const catchAsync = require('../utils/catchAsync');
const authService = require('../services/authService');

const register = catchAsync(async (req, res) => {
  const data = await authService.sendRegistrationCode(req.body);
  res.status(201).json({ success: true, data });
});

const verifyRegister = catchAsync(async (req, res) => {
  const data = await authService.verifyRegistrationCode(req.body);
  res.status(201).json({ success: true, data });
});

const login = catchAsync(async (req, res) => {
  const data = await authService.login(req.body);
  res.json({ success: true, data });
});

const refresh = catchAsync(async (req, res) => {
  const data = await authService.refresh(req.body.refreshToken);
  res.json({ success: true, data });
});

const logout = catchAsync(async (req, res) => {
  const data = await authService.logout(req.body.refreshToken);
  res.json({ success: true, data });
});

const me = catchAsync(async (req, res) => {
  const data = await authService.getCurrentUser(req.user.id);
  res.json({ success: true, data });
});

module.exports = { register, verifyRegister, login, refresh, logout, me };
