import instance from "~/instanceAxios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function changeAvatar(formData) {
  return await instance.patch(`/user/avatar`, formData, {
    headers: {
      Authorization: `Bearer ${cookies.get("token")}`,
    },
  });
}
