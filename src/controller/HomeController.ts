import { Request, Response } from "express";
import { BaseController } from "./BaseController";

export class HomeController extends BaseController {
  index = async (req: Request, res: Response) => {
    return this.singleResponseWithSuccess(res, "Welcome to Blog NodeJS!", {
      name: "Rafsan",
    });
  };
}

export default new HomeController();
