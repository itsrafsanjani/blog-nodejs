import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { PersonalAccessToken } from "../entity/PersonalAccessToken";

const auth = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(403).json({
      message: "A token is required for authentication",
    });
  }

  const token = authorization.split(" ")[1];
  try {
    const personalAccessToken = await AppDataSource.getRepository(
      PersonalAccessToken
    ).findOne({
      where: { token: token },
    });

    if (!personalAccessToken) {
      return res.status(401).json({
        message: "Invalid token.",
      });
    }

    res.locals.user = personalAccessToken.user;
  } catch (err) {
    console.error(err);
    return res.status(401).json({
      message: "Invalid token.",
    });
  }
  return next();
};

export default auth;
