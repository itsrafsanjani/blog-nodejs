import { AppDataSource } from "./data-source";
import * as express from "express";
import * as bodyParser from "body-parser";

import routes from "./routes/api";
import * as cors from "cors";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");

    // create and setup express app
    const app = express();

    // Serve the public directory as a static directory
    app.use(express.static("public"));

    app.use(cors());

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    const port = process.env.APP_PORT ?? 3000;

    app.use("/api", routes);

    // start express server
    app.listen(port);
    console.log("Node started in http://localhost:" + port);
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
