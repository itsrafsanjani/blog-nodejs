import { isEmpty, validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { BaseController } from "./BaseController";
import { compare, hash } from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import config from "../config/app";
import sendMail from "../services/mail";
import { getOtp, validateOtp } from "../services/otp";
import { removeObjectProperties } from "../helpers/global";
import { JwtPayload } from "jsonwebtoken";

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

      const refreshToken = sign(
        { userId: user.id, firstName: user.firstName, lastName: user.lastName },
        config.jwtSecret,
        { expiresIn: Number(config.refreshJwtExpiresIn) }
      );

      // TODO: store refresh token to database refreshToken column
      const hashedRefreshToken = await hash(refreshToken, 10);

      // Save the hashed refresh token to the database
      user.refreshToken = hashedRefreshToken;
      await AppDataSource.getRepository(User).save(user);

      const accessToken = sign(
        { userId: user.id, firstName: user.firstName, lastName: user.lastName },
        config.jwtSecret,
        { expiresIn: Number(config.jwtExpiresIn) }
      );

      return this.singleResponseWithSuccess(res, "Login successful.", {
        access_token: accessToken,
        token_type: "Bearer",
        refresh_token: refreshToken,
        user: user,
      });
    }

    return this.responseWithError(res, "Credential does not match", [], 401);
  };

  refresh = async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    try {
      const decoded = verify(refreshToken, config.jwtSecret) as JwtPayload;
      const attemptedUser = await AppDataSource.getRepository(User).findOne({
        select: ["id", "refreshToken"],
        where: { id: decoded.userId },
      });

      if (!attemptedUser) {
        return this.responseWithError(res, "Invalid refresh token.", [], 401);
      }

      if (!(await compare(refreshToken, attemptedUser.refreshToken))) {
        return this.responseWithError(res, "Invalid refresh token.", [], 401);
      }

      const user = await AppDataSource.getRepository(User).findOneBy({
        id: Number(attemptedUser.id),
      });

      const accessToken = sign(
        { userId: user.id, firstName: user.firstName, lastName: user.lastName },
        config.jwtSecret,
        { expiresIn: Number(config.jwtExpiresIn) }
      );

      return this.singleResponseWithSuccess(res, "Access token refreshed.", {
        access_token: accessToken,
        token_type: "Bearer",
        user: user,
      });
    } catch (err) {
      return this.responseWithError(
        res,
        err.message || "Invalid refresh token.",
        [],
        401
      );
    }
  };

  user = async (req: Request, res: Response) => {
    await AppDataSource.getRepository(User)
      .findOneBy({
        id: Number(res.locals.user.userId),
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
