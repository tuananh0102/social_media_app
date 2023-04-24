import instance from "~/instanceAxios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function getUserById(id) {
  return await instance.get(`/user/${id}`, {
    headers: {
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
}
