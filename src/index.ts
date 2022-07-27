import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import * as express from "express";
import { Request, Response } from "express";
import UserController from "./controller/UserController";

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

// register routes
app.get("/", function (req: Request, res: Response) {
  return res.send({
    message: "Welcome to Blog NodeJS!",
  });
});

// register routes

// users.index
app.get("/users", UserController.index);

app.get("/users/:id", UserController.show);

app.post("/users", UserController.store);

app.put("/users/:id", UserController.update);

app.delete("/users/:id", UserController.destroy);

// start express server
app.listen(port);
console.log("Node started in http://localhost:" + port);
