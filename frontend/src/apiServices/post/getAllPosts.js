import instance from "~/instanceAxios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function getAllPosts() {
  return await instance.get(`/allPosts`, {
    headers: {
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
}
