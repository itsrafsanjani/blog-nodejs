import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import * as express from "express";
import { Request, Response } from "express";
import { validate } from "class-validator";
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

app.get("/users/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(User).findOneBy({
    id: Number(req.params.id),
  });
  return res.send(results);
});

app.post("/users", async function (req: Request, res: Response) {
  let user = new User();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.age = req.body.age;

  const errors = await validate(user, { validationError: { target: false } });
  if (errors.length > 0) {
    return res.status(422).send(errors);
  }

  const result = await AppDataSource.manager.save(user);
  return res.send(result);
  // const user = await AppDataSource.getRepository(User).create(req.body);
  // const results = await AppDataSource.getRepository(User).save(user);
});

app.put("/users/:id", async function (req: Request, res: Response) {
  const user = await AppDataSource.getRepository(User).findOneBy({
    id: Number(req.params.id),
  });
  AppDataSource.getRepository(User).merge(user, req.body);
  const results = await AppDataSource.getRepository(User).save(user);
  return res.send(results);
});

app.delete("/users/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(User).delete(req.params.id);
  return res.send(results);
});

// start express server
app.listen(port);
console.log("Node started in http://localhost:" + port);
