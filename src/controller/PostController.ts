import { validate } from "class-validator";
import { JSDOM } from "jsdom";
import * as DOMPurify from "dompurify";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Post } from "../entity/Post";
import { BaseController } from "./BaseController";
import PostCollection from "../resources/PostCollection";
import PostResource from "../resources/PostResource";
import { User } from "../entity/User";
import slugify from "slugify";

export class PostController extends BaseController {
  index = async (req: Request, res: Response) => {
    const posts = await AppDataSource.getRepository(Post).find({
      relations: ["user"],
    });
    return this.multipleResponseWithSuccess(
      res,
      "Posts retrieved successfully",
      PostCollection(posts),
      200
    );
  };
  show = async (req: Request, res: Response) => {
    await AppDataSource.getRepository(Post)
      .findOne({
        where: { id: Number(req.params.id) },
        relations: ["user"],
      })
      .then((post) => {
        post
          ? this.singleResponseWithSuccess(
              res,
              "Post retrieved successfully",
              PostResource(post)
            )
          : this.responseWithError(res, "Post not found");
      })
      .catch((errors) => {
        return this.responseWithError(res, "Unexpected error", errors);
      });
  };
  store = async (req: Request, res: Response) => {
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: res.locals.user.id },
    });
    const { title, description, tags, publishedAt } = req.body;

    const { filename } = req.file;

    const post = new Post();

    const sanitizedDescription = purify.sanitize(description, {
      ALLOWED_TAGS: [],
    });

    const excerpt =
      sanitizedDescription.length > 255
        ? sanitizedDescription.slice(0, 252) + "..."
        : sanitizedDescription;

    console.log(excerpt);

    Object.assign(post, {
      user,
      title,
      slug: slugify(title, { lower: true }).slice(0, 220) + "-" + Date.now(),
      excerpt: excerpt.replace(/\n/g, ""),
      description: purify.sanitize(description),
      thumbnail: "uploads/" + filename,
      tags,
      publishedAt,
    });

    const errors = await validate(post, {
      validationError: { target: false },
    });
    if (errors.length > 0) {
      return res.status(422).send(errors);
    }

    await AppDataSource.getRepository(Post)
      .save(post)
      .then((createdPost) => {
        return this.singleResponseWithSuccess(
          res,
          "Post stored successfully",
          PostResource(createdPost)
        );
      })
      .catch((errors) => {
        return this.responseWithError(res, "Unexpected error", errors);
      });
  };
  update = async (req: Request, res: Response) => {
    let post = await AppDataSource.getRepository(Post).findOne({
      where: { id: Number(req.params.id) },
      relations: ["user"],
    });

    if (!post) {
      return this.responseWithError(res, "Post not found");
    }

    if (post.user.id !== res.locals.user.id) {
      return this.responseWithError(res, "Unauthorized");
    }

    const { title, description, publishedAt } = req.body;

    const filename = req.file?.filename;

    if (filename) {
      Object.assign(post, {
        thumbnail: "uploads/" + filename,
      });
    }

    Object.assign(post, {
      title,
      description,
      publishedAt,
    });

    const errors = await validate(post, { validationError: { target: false } });
    if (errors.length > 0) {
      return res.status(422).send(errors);
    }

    AppDataSource.getRepository(Post).merge(post, req.body);
    await AppDataSource.getRepository(Post)
      .save(post)
      .then((updatedPost) => {
        return this.singleResponseWithSuccess(
          res,
          "Post updated successfully",
          PostResource(updatedPost)
        );
      })
      .catch((errors) => {
        return this.responseWithError(res, "Unexpected error", errors);
      });
  };
  destroy = async (req: Request, res: Response) => {
    await AppDataSource.getRepository(Post)
      .delete(req.params.id)
      .then((post) => {
        post.affected
          ? this.singleResponseWithSuccess(res, "Post deleted successfully")
          : this.responseWithError(res, "Post not found");
      })
      .catch((errors) => {
        return this.responseWithError(res, "Unexpected error", errors);
      });
  };
}

export default new PostController();
