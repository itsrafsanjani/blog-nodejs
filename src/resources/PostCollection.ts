import { Post } from "../entity/Post";
import PostResource from "./PostResource";

class PostCollection {
  getAttributes = (posts: Post[]) => {
    return posts.map((post) => PostResource.getAttributes(post));
  };
}

export default new PostCollection();
