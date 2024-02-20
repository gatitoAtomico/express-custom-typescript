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

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export default User;
