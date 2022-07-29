import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { BaseController } from "./BaseController";

export class AuthController extends BaseController {
  register = async (req: Request, res: Response) => {
    const user = new User();
    user.email = req.body.email;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.age = req.body.age;

    const errors = await validate(user, { validationError: { target: false } });
    if (errors.length > 0) {
      return this.responseWithError(res, "Validation error", errors, 422);
    }

    const result = await AppDataSource.getRepository(User).save(user);

    return this.singleResponseWithSuccess(
      res,
      "Registration successful.",
      result
    );
  };
}

export default new AuthController();
