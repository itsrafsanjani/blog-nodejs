import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import config from "../config/app";

const auth = (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(403).json({
      message: "A token is required for authentication",
    });
  }

  const token = authorization.split(" ")[1];
  try {
    const decoded = verify(token, config.jwtSecret);
    res.locals.user = decoded;
  } catch (err) {
    return res.status(401).json({
      message: "Invalid Token",
    });
  }
  return next();
};

export default auth;
