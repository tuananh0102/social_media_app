import instance from "~/instanceAxios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function deleteRequestAddFriend(userId) {
  return await instance.delete(`/friendship`, {
    params: {
      userId1: parseInt(userId),
    },
    headers: {
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
}
