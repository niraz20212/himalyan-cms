const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signAccessToken = (payload) => jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
const signRefreshToken = (payload) =>
  jwt.sign(payload, env.jwtRefreshSecret, { expiresIn: env.jwtRefreshExpiresIn });

module.exports = { signAccessToken, signRefreshToken };
