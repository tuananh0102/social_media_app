import instance from "~/instanceAxios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function getUserByName(name) {
  return await instance.get(`/users`, {
    params: {
      name: name,
    },
    headers: {
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
}
