import { Sequelize, DataTypes } from "sequelize";
import { DB_HOST, DB_NAME, DB_USER, DB_PASSWORD } from "config/envs";

const sequelize = new Sequelize({
  dialect: "mysql",
  host: DB_HOST,
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  logging: false,
});

const RefreshToken = sequelize.define("RefreshToken", {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "User",
      key: "id",
    },
  },
});

export default RefreshToken;
