import { AppDataSource } from "./data-source";
import * as express from "express";
import UserController from "./controller/UserController";
import HomeController from "./controller/HomeController";
import AuthController from "./controller/AuthController";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

// create and setup express app
const app = express();
app.use(express.json());
const port = process.env.APP_PORT ?? 3000;

// home route
app.get("/", HomeController.index);

// auth routes
app.post("/register", AuthController.register);
app.post("/login", AuthController.login);

// users routes
app.get("/users", UserController.index);
app.get("/users/:id", UserController.show);
app.post("/users", UserController.store);
app.put("/users/:id", UserController.update);
app.delete("/users/:id", UserController.destroy);

// start express server
app.listen(port);
console.log("Node started in http://localhost:" + port);
