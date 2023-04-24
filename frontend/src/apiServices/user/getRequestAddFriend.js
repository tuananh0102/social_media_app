import instance from "~/instanceAxios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function getRequestAddFriend() {
  const id = parseInt(cookies.get("id"));
  return await instance.get(`/friendship/request`, {
    params: {
      userId: id,
    },
    headers: {
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
}
