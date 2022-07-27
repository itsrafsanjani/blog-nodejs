import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export class UserController {
  index = async (req: Request, res: Response) => {
    const users = await AppDataSource.getRepository(User).find();
    res.json(users);
  };
  show = async (req: Request, res: Response) => {
    const results = await AppDataSource.getRepository(User).findOneBy({
      id: Number(req.params.id),
    });
    return res.send(results);
  };
  store = async (req: Request, res: Response) => {
    const user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.age = req.body.age;

    const errors = await validate(user, { validationError: { target: false } });
    if (errors.length > 0) {
      return res.status(422).send(errors);
    }

    const result = await AppDataSource.getRepository(User).save(user);
    return res.send(result);
  };
  update = async (req: Request, res: Response) => {
    let user = await AppDataSource.getRepository(User).findOneBy({
      id: Number(req.params.id),
    });
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.age = req.body.age;

    const errors = await validate(user, { validationError: { target: false } });
    if (errors.length > 0) {
      return res.status(422).send(errors);
    }

    AppDataSource.getRepository(User).merge(user, req.body);
    const results = await AppDataSource.getRepository(User).save(user);
    return res.send(results);
  };
  destroy = async (req: Request, res: Response) => {
    const results = await AppDataSource.getRepository(User).delete(
      req.params.id
    );
    return res.send(results);
  };
}

export default new UserController();
