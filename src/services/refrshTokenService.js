import refreshTokenModel from "../models/refreshTokenModel";
import HTTPError from "utils/HTTPError";

const refreshTokenService = {
  async checkIfTokenExists({ user }) {
    try {
      return await refreshTokenModel.findOne({
        where: {
          userId: user.id,
        },
      });
    } catch (error) {
      throw new HTTPError(error.message, 400);
    }
  },
  async removeToken(token) {
    try {
      return await refreshTokenModel.destroy({
        where: {
          id: token.id,
        },
      });
    } catch (error) {
      throw new HTTPError(error.message, 400);
    }
  },
  async createRefreshToken({ token, user }) {
    try {
      return await refreshTokenModel.create({
        token,
        userId: user.id,
      });
    } catch (error) {
      throw new HTTPError(error.message, 400);
    }
  },
  async findToken({ token }) {
    try {
      return await refreshTokenModel.findOne({
        where: {
          token,
        },
      });
    } catch (error) {
      throw new HTTPError(error.message, 400);
    }
  },
};

export default refreshTokenService;
