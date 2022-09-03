import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { BaseController } from "./BaseController";

export class UserController extends BaseController {
  index = async (req: Request, res: Response) => {
    const users = await AppDataSource.getRepository(User).find();
    return this.multipleResponseWithSuccess(
      res,
      "Users retrieved successfully",
      users,
      200
    );
  };
  show = async (req: Request, res: Response) => {
    await AppDataSource.getRepository(User)
      .findOneBy({
        id: Number(req.params.id),
      })
      .then((result) => {
        result
          ? this.singleResponseWithSuccess(
              res,
              "User retrieved successfully",
              result
            )
          : this.responseWithError(res, "User not found");
      })
      .catch((errors) => {
        return this.responseWithError(res, "Unexpected error", errors);
      });
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

    await AppDataSource.getRepository(User)
      .save(user)
      .then((result) => {
        return this.singleResponseWithSuccess(
          res,
          "User stored successfully",
          result
        );
      })
      .catch((errors) => {
        return this.responseWithError(res, "Unexpected error", errors);
      });
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
    await AppDataSource.getRepository(User)
      .save(user)
      .then((result) => {
        return this.singleResponseWithSuccess(
          res,
          "User updated successfully",
          result
        );
      })
      .catch((errors) => {
        return this.responseWithError(res, "Unexpected error", errors);
      });
  };
  destroy = async (req: Request, res: Response) => {
    await AppDataSource.getRepository(User)
      .delete(req.params.id)
      .then((result) => {
        result.affected
          ? this.singleResponseWithSuccess(res, "User deleted successfully")
          : this.responseWithError(res, "User not found");
      })
      .catch((errors) => {
        return this.responseWithError(res, "Unexpected error", errors);
      });
  };
}

export default new UserController();
