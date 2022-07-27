import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export class UserController {
  index = async (req: Request, res: Response) => {
    const users = await AppDataSource.getRepository(User).find();
    res.json(users);
  };
}

export default new UserController();
