import instance from "~/instanceAxios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function getFriendUser(id) {
  return await instance.get(`/friends/${id}`, {
    headers: {
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
}
