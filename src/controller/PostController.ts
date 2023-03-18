import { validate } from "class-validator";
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Post } from "../entity/Post";
import { BaseController } from "./BaseController";

export class PostController extends BaseController {
  index = async (req: Request, res: Response) => {
    const posts = await AppDataSource.getRepository(Post).find();
    return this.multipleResponseWithSuccess(
      res,
      "Posts retrieved successfully",
      posts,
      200
    );
  };
  show = async (req: Request, res: Response) => {
    await AppDataSource.getRepository(Post)
      .findOneBy({
        id: Number(req.params.id),
      })
      .then((result) => {
        result
          ? this.singleResponseWithSuccess(
              res,
              "Post retrieved successfully",
              result
            )
          : this.responseWithError(res, "Post not found");
      })
      .catch((errors) => {
        return this.responseWithError(res, "Unexpected error", errors);
      });
  };
  store = async (req: Request, res: Response) => {
    const { title, description, thumbnail, publishedAt } = req.body;

    const post = new Post();

    Object.assign(post, {
      title,
      description,
      thumbnail,
      publishedAt,
    });

    const errors = await validate(post, { validationError: { target: false } });
    if (errors.length > 0) {
      return res.status(422).send(errors);
    }

    await AppDataSource.getRepository(Post)
      .save(post)
      .then((result) => {
        return this.singleResponseWithSuccess(
          res,
          "Post stored successfully",
          result
        );
      })
      .catch((errors) => {
        return this.responseWithError(res, "Unexpected error", errors);
      });
  };
  update = async (req: Request, res: Response) => {
    let post = await AppDataSource.getRepository(Post).findOneBy({
      id: Number(req.params.id),
    });

    const { title, description, thumbnail, publishedAt } = req.body;

    Object.assign(post, {
      title,
      description,
      thumbnail,
      publishedAt,
    });

    const errors = await validate(post, { validationError: { target: false } });
    if (errors.length > 0) {
      return res.status(422).send(errors);
    }

    AppDataSource.getRepository(Post).merge(post, req.body);
    await AppDataSource.getRepository(Post)
      .save(post)
      .then((result) => {
        return this.singleResponseWithSuccess(
          res,
          "Post updated successfully",
          result
        );
      })
      .catch((errors) => {
        return this.responseWithError(res, "Unexpected error", errors);
      });
  };
  destroy = async (req: Request, res: Response) => {
    await AppDataSource.getRepository(Post)
      .delete(req.params.id)
      .then((result) => {
        result.affected
          ? this.singleResponseWithSuccess(res, "Post deleted successfully")
          : this.responseWithError(res, "Post not found");
      })
      .catch((errors) => {
        return this.responseWithError(res, "Unexpected error", errors);
      });
  };
}

export default new PostController();
