import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { BaseController } from "./BaseController";
import { hash} from "bcryptjs";

export class AuthController extends BaseController {
  register = async (req: Request, res: Response) => {
    const user = new User();

    const errors = await validate(req.body, {
      validationError: { target: false },
    });
    if (errors.length > 0) {
      return this.responseWithError(res, "Validation error", errors, 422);
    }

    const { email, firstName, lastName, age, password } = req.body;
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.age = age;
    user.password = await hash(password, 10);

    await AppDataSource.getRepository(User)
      .save(user)
      .then((result) => {
        return this.singleResponseWithSuccess(
          res,
          "Registration successful.",
          result
        );
      })
      .catch((error) => {
        return this.responseWithError(res, "Validation error", [
          {
            value: "",
            property: "email",
            children: [],
            constraints: {
              isUnique: "email is already used",
            },
          },
        ]);
      });
  };
}

export default new AuthController();
