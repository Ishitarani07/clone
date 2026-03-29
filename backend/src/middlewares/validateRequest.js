import { validationResult } from 'express-validator';
import { sendError } from '../utils/apiResponse.js';

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, 400, errors.array()[0].msg);
  }

  next();
};

export default validateRequest;
