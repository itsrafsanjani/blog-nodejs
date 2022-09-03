import { AppDataSource } from "./data-source";
import * as express from "express";
import routes from "./routes/api";
import * as cors from "cors";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    // create and setup express app
    const app = express();
    app.use(cors());
    app.use(express.json());
    const port = process.env.APP_PORT ?? 3000;

    app.use("/api", routes);

    // start express server
    app.listen(port);
    console.log("Node started in http://localhost:" + port);
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
