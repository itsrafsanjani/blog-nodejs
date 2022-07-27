import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import * as express from "express";
import { Request, Response } from "express";
const app = express();
app.use(express.json());
const port = process.env.APP_PORT ?? 3000;

AppDataSource.initialize().then(async () => {
    // register routes
    app.get("/", function (req: Request, res: Response) {
      return res.send({
        message: "Welcome to Blog NodeJS!",
      });
    });

    app.get("/users", function (req: Request, res: Response) {
      // here we will have logic to return all users
    });

    app.get("/users/:id", function (req: Request, res: Response) {
      // here we will have logic to return user by id
    });

    app.post("/users", function (req: Request, res: Response) {
      // here we will have logic to save a user
    });

    app.put("/users/:id", function (req: Request, res: Response) {
      // here we will have logic to update a user by a given user id
    });

    app.delete("/users/:id", function (req: Request, res: Response) {
      // here we will have logic to delete a user by a given user id
    });

    // start express server
    app.listen(port);
    console.log("Node started in http://localhost:" + port);
    

}).catch(error => console.log(error))
