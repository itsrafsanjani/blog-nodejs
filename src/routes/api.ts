import { Router } from "express";
import UserController from "../controller/UserController";
import HomeController from "../controller/HomeController";
import AuthController from "../controller/AuthController";
import auth from "../middleware/auth";
import PostController from "../controller/PostController";

const routes = Router();

// home route
routes.get("/", HomeController.index);

// auth routes
routes.post("/register", AuthController.register);
routes.post("/login", AuthController.login);
routes.post("/verify/:id", AuthController.verify);

routes.use(auth);
routes.get("/user", AuthController.user);
// users routes
routes.get("/users", UserController.index);
routes.get("/users/:id", UserController.show);
routes.post("/users", UserController.store);
routes.put("/users/:id", UserController.update);
routes.delete("/users/:id", UserController.destroy);

// posts routes
routes.get("/posts", PostController.index);
routes.get("/posts/:id", PostController.show);
routes.post("/posts", PostController.store);
routes.put("/posts/:id", PostController.update);
routes.delete("/posts/:id", PostController.destroy);

export default routes;
