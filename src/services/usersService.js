import usersModel from "../models/usersModel";
import HTTPError from "utils/HTTPError";

const usersService = {
  async createUser({ username, password, email }) {
    try {
      return await usersModel.create({
        username,
        password,
        email,
      });
    } catch (error) {
      throw new HTTPError(error.message, 400);
    }
  },
  async findUerByEmail(email) {
    try {
      return await usersModel.findOne({
        where: {
          email,
        },
      });
    } catch (error) {
      throw new HTTPError(error.message, 400);
    }
  },
  async findUserById({ id }) {
    try {
      return await usersModel.findOne({
        where: {
          id,
        },
      });
    } catch (error) {
      throw new HTTPError(error.message, 400);
    }
  },
};

export default usersService;
