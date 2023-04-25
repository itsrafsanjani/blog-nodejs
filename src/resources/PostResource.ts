import { Post } from "../entity/Post";
import { asset } from "../helpers/global";

const PostResource = (post: Post) => {
  return {
    ...post,
    thumbnail: asset(post.thumbnail),
  };
};

export default PostResource;
