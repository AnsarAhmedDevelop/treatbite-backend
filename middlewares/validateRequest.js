// middlewares/validateRequest.js
import { validationResult } from "express-validator";
import createHttpError from "http-errors";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw createHttpError(400, errors.array()[0].msg);
    // return res.status(400).json({
    //   error: errors.array()[0].msg,
    //   details: errors.array(),
    // });
  }
  next();
};