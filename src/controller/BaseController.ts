import { Response } from "express";

export class BaseController {
  singleResponseWithSuccess = async (
    res: Response,
    message: string = "",
    data?: Object,
    statusCode: number = 200
  ) => {
    return res.status(statusCode).json({
      message,
      data,
    });
  };

  multipleResponseWithSuccess = async (
    res: Response,
    message: string = "",
    data?: string[],
    statusCode: number = 200
  ) => {
    return res.status(statusCode).json({
      message,
      data,
    });
  };
}
