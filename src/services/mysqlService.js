import mysql from "mysql2/promise";
import { DB_HOST, DB_PASS, DB_USER, DB_NAME } from "config/envs";

let connection;

const mysqlService = {
  async connect() {
    connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
    });
  },
  test: async () => {
    return connection.query("SELECT * FROM `test`");
  },
};

export default mysqlService;
