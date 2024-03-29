import { compare, hash } from "bcryptjs";
import { isEmpty, validate } from "class-validator";
import { Request, Response } from "express";
import * as useragent from "useragent";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { removeObjectProperties } from "../helpers/global";
import PersonalAccessTokenService from "../services/PersonalAccessTokenService";
import sendMail from "../services/mail";
import { getOtp, validateOtp } from "../services/otp";
import { BaseController } from "./BaseController";

export class AuthController extends BaseController {
  register = async (req: Request, res: Response) => {
    const user = new User();
    const { email, firstName, lastName, age, password } = req.body;
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.age = age;
    user.password = password;

    // generate otp and save to user table
    let otp = getOtp();
    user.otp = otp;

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
        sendMail({
          to: user.email,
          subject: "Email Verification",
          text: `
          Use this code for verification.
          ${otp}
          This code will be valid for 5 minutes.
          `,
        });

        removeObjectProperties(result, ["password", "otp"]);

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

  verify = async (req: Request, res: Response) => {
    const otp = Number(req.body.otp);

    if (isEmpty(otp)) {
      return this.responseWithError(res, "Otp required", [], 422);
    }

    let user = await AppDataSource.getRepository(User).findOne({
      select: ["id", "emailVerifiedAt", "otp"],
      where: { id: Number(req.params.id) },
    });

    if (!user) {
      return this.responseWithError(res, "User not found", [], 404);
    }

    if (user.emailVerifiedAt) {
      return this.singleResponseWithSuccess(
        res,
        "User email already verified",
        [],
        200
      );
    }

    // if user email is not verified and
    // otp column is empty then
    // send otp again and save to db
    if (!user.otp) {
      let otp = getOtp();
      sendMail({
        to: user.email,
        subject: "Email Verification",
        text: `
          Use this code for verification.
          ${otp}
          This code will be valid for 5 minutes.
          `,
      });

      user.otp = otp;
      await AppDataSource.getRepository(User).save(user);

      return this.singleResponseWithSuccess(
        res,
        "OTP sent again successfully",
        [],
        200
      );
    }

    const result = validateOtp({
      otp,
      dbOtp: user.otp,
    });

    if (result) {
      user.emailVerifiedAt = new Date();
      user.otp = null;
      await AppDataSource.getRepository(User).save(user);
      return this.singleResponseWithSuccess(
        res,
        "Email verified successfully",
        [],
        200
      );
    }

    return this.responseWithError(res, "OTP does not match", [], 401);
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

      const clientIp = req.ip;
      const userAgent = useragent.parse(req.headers["user-agent"]);

      // generate a personal access token
      const personalAccessToken = await PersonalAccessTokenService.createToken(
        user,
        `${userAgent.toString()} (IP: ${clientIp})`
      );

      return this.singleResponseWithSuccess(res, "Login successful.", {
        token: personalAccessToken.token,
        token_type: "Bearer",
        user: user,
      });
    }

    return this.responseWithError(res, "Credential does not match", [], 401);
  };

  user = async (req: Request, res: Response) => {
    await AppDataSource.getRepository(User)
      .findOneBy({
        id: Number(res.locals.user.id),
      })
      .then((user) => {
        this.singleResponseWithSuccess(
          res,
          "Authenticated user retrieved successfully",
          user
        );
      })
      .catch((errors) => {
        return this.responseWithError(res, "Unexpected error", errors);
      });
  };
}

export default new AuthController();
