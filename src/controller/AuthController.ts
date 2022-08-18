import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { BaseController } from "./BaseController";
import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import config from "../config/app";
import sendMail from "../services/mail";

export class AuthController extends BaseController {
  register = async (req: Request, res: Response) => {
    const user = new User();
    const { email, firstName, lastName, age, password } = req.body;
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.age = age;
    user.password = password;

    const errors = await validate(user, {
      validationError: { target: false },
    });

    if (errors.length > 0) {
      return this.responseWithError(res, "Validation error", errors, 422);
    }

    user.password = await hash(password, 10);

    await AppDataSource.getRepository(User)
      .save(user)
      .then((result) => {
        sendMail(user.email);
        return this.singleResponseWithSuccess(
          res,
          "Registration successful.",
          result
        );
      })
      .catch((errors) => {
        return this.responseWithError(res, "Unexpected error", errors);
      });
  };

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const attemptedUser = await AppDataSource.getRepository(User).findOne({
      select: ["id", "email", "password"],
      where: { email: email },
    });

    if (!(email && password)) {
      return this.responseWithError(
        res,
        "Email and Password required",
        [],
        422
      );
    }

    if (!attemptedUser) {
      return this.responseWithError(res, "Credential does not match", [], 401);
    }

    if (await compare(password, attemptedUser.password)) {
      const user = await AppDataSource.getRepository(User).findOneBy({
        id: Number(attemptedUser.id),
      });
      // Sign JWT, valid for 1 hour
      const token = sign(
        { userId: user.id, firstName: user.firstName, lastName: user.lastName },
        config.jwtSecret,
        { expiresIn: Number(config.jwtExpiresIn) }
      );

      return this.singleResponseWithSuccess(res, "Login successful.", {
        token: token,
        token_type: "Bearer",
        user: user,
      });
    }

    return this.responseWithError(res, "Credential does not match", [], 401);
  };
}

export default new AuthController();
