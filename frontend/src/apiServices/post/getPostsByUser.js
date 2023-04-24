import instance from "~/instanceAxios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function getPostsByUser(id) {
  return await instance.get(`/user/${id}/posts`, {
    headers: {
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
}
