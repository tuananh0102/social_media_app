import instance from "~/instanceAxios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function getIsFriend(id) {
  return await instance.get(`/isfriend`, {
    params: {
      requestId: id,
    },
    headers: {
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
}
