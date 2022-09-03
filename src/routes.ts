import { Router } from "express";
import RouteGroup from "express-route-grouping";
import UserController from "./controller/UserController";
import HomeController from "./controller/HomeController";
import AuthController from "./controller/AuthController";

const routes = new RouteGroup("/", Router());

routes.group("api", (routes) => {
  // home route
  routes.get("/", HomeController.index);

  // auth routes
  routes.post("/register", AuthController.register);
  routes.post("/login", AuthController.login);
  routes.post("/verify/:id", AuthController.verify);

  // users routes
  routes.get("/users", UserController.index);
  routes.get("/users/:id", UserController.show);
  routes.post("/users", UserController.store);
  routes.put("/users/:id", UserController.update);
  routes.delete("/users/:id", UserController.destroy);
});

export default routes;
