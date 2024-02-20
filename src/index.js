import cors from "cors";
import mysqlService from "services/mysqlService";
import express from "express";
import { PORT } from "./config/envs";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/user";

// import AdvancedServer from "@lib/AdvancedServer/AdvancedServer";
// import mongooseService from "services/mongoose.service";
// import HTTPError from "utils/HTTPError";

async function main() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  await mysqlService.connect();

  app.get("/", (req, res) => {
    res.send("Server is running!");
  });

  app.use("/api", authRoutes);
  app.use("/api", userRoutes);

  app.listen(3000, () => {
    console.log(`Example app listening on port ${PORT}!`);
  });

  // let result = await mysqlService.test();
  // console.log(result);
  // console.log("all good");
}

main();
