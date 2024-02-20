import express from "express";
import HTTPError from "utils/HTTPError";
import Joi from "joi";
import errorHandler from "utils/errorHandler";
import isAuthenticated from "middleware/isAuthenticated";

const router = express.Router();

router.get("/user", isAuthenticated, async (req, res, next) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);
export default router;
