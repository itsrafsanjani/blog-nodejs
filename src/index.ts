import { AppDataSource } from "./data-source";
import { User } from "./entity/User";
import * as express from "express";
import { Request, Response } from "express";

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
app.get("/users", async function (req: Request, res: Response) {
  const users = await AppDataSource.getRepository(User).find();
  res.json(users);
});

app.get("/users/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(User).findOneBy({
    id: Number(req.params.id),
  });
  return res.send(results);
});

app.post("/users", async function (req: Request, res: Response) {
  const user = await AppDataSource.getRepository(User).create(req.body);
  const results = await AppDataSource.getRepository(User).save(user);
  return res.send(results);
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
