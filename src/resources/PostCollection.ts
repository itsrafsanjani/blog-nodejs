import { Post } from "../entity/Post";
import PostResource from "./PostResource";

const PostCollection = (posts: Post[]) => {
  return posts.map((post) => PostResource(post));
};

export default PostCollection;
