import instance from "~/instanceAxios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function createComment(postId, data) {
  return await instance.post(`/comment/post/${postId}`, data, {
    headers: {
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
}
