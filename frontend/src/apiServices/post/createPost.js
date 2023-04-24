import instance from "~/instanceAxios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function createPost(formData) {
  return await instance.post(`/post`, formData, {
    headers: {
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
}
