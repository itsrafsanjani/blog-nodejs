import { Response } from "express";

export class BaseController {
  singleResponseWithSuccess = async (
    res: Response,
    message: string = "",
    data: Object = {},
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
    data: Object[] = [],
    statusCode: number = 200
  ) => {
    return res.status(statusCode).json({
      message,
      data,
    });
  };

  responseWithError = async (
    res: Response,
    message: string = "",
    data: Object = {},
    statusCode: number = 404
  ) => {
    return res.status(statusCode).json({
      message,
      data,
    });
  };
}
