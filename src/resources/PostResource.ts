import { Post } from "../entity/Post";
import { asset } from "../helpers/global";

class PostResource {
  getAttributes(post: Post) {
    return {
      ...post,
      thumbnail: asset(post.thumbnail),
    };
  }
}

export default new PostResource();
