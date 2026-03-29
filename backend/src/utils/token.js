import jwt from 'jsonwebtoken';

const TOKEN_NAME = 'token';
const DEFAULT_COOKIE_DAYS = parseInt(process.env.JWT_COOKIE_EXPIRES || '7', 10);
const COOKIE_MAX_AGE = DEFAULT_COOKIE_DAYS * 24 * 60 * 60 * 1000;

const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: COOKIE_MAX_AGE,
  };
};

export const generateToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const setAuthCookie = (res, token) => {
  res.cookie(TOKEN_NAME, token, getCookieOptions());
};

export const clearAuthCookie = (res) => {
  res.clearCookie(TOKEN_NAME, {
    ...getCookieOptions(),
    maxAge: 0,
  });
};

export const attachTokenToResponse = (res, userId) => {
  const token = generateToken(userId);
  setAuthCookie(res, token);
  return token;
};
