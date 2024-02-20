import express from "express";
import HTTPError from "utils/HTTPError";
import Joi from "joi";
import errorHandler from "utils/errorHandler";
import bcrypt from "bcrypt";
import usersService from "services/usersService";
import refreshTokenService from "services/refrshTokenService";
import { SECRET } from "config/envs";
import randomToken from "random-token";
import { sign } from "jsonwebtoken";

const router = express.Router();
const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

router.post("/auth/login", async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body);

    if (error) {
      throw new HTTPError(error.message, 400);
    }

    let secret = SECRET;
    const { email, password } = value;

    let user = await usersService.findUerByEmail(email);

    if (!user) {
      throw new HTTPError("User not found", 404);
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (isPasswordCorrect) {
      const jwtToken = sign(user.toJSON(), secret, { expiresIn: "10m" });

      let rfToken = await refreshTokenService.checkIfTokenExists({ user });

      if (rfToken) {
        await refreshTokenService.removeToken(rfToken);
      }

      let newRefreshToken = randomToken(16) + user.id.toString();

      let refTokenBody = {
        token: newRefreshToken,
        user: user,
      };

      let refreshToken = await refreshTokenService.createRefreshToken({
        token: refTokenBody.token,
        user: refTokenBody.user,
      });

      let response = { jwt: jwtToken, refreshToken: refreshToken.token };

      res.status(200).json({
        message: response,
      });

      return;
    }
    res.status(401).json({ message: "passwords do not match" });
  } catch (error) {
    next(error);
  }
});

const registerSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

router.post("/auth/register", async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body);

    if (error) {
      throw new HTTPError(error.message, 400);
    }

    const { username, password, email } = value;

    let salt = await bcrypt.hash(password, 12);

    let user = await usersService.createUser({
      username,
      password: salt,
      email,
    });

    return res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
});

const refreshJwtSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

router.post("/auth/refreshJwt", async (req, res, next) => {
  try {
    const { value, error } = refreshJwtSchema.validate(req.body);

    if (error) {
      throw new HTTPError(error.message, 400);
    }
    const { refreshToken } = value;

    let rfToken = await refreshTokenService.findToken({ token: refreshToken });
    const twoDaysInMs = 2 * 24 * 60 * 60 * 1000;
    const now = new Date();
    const timeDiffInMs = now.getTime() - rfToken.createdAt.getTime();

    if (timeDiffInMs >= twoDaysInMs) {
      res.status(401).json({ message: "your session has expired" });
    } else {
      let user = await usersService.findUserById({ id: rfToken.userId });
      const jwtToken = sign(user.toJSON(), SECRET, { expiresIn: "10m" });
      res.status(200).json({ message: "new jwt token created", jwtToken });
    }
  } catch (error) {
    next(error);
  }
});

router.use(errorHandler);
export default router;
