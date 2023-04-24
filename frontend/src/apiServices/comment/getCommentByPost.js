import instance from "~/instanceAxios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function getCommentByPost(postId) {
  return await instance.get(`/comments/post`, {
    params: {
      postId: postId,
    },
    headers: {
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
}
