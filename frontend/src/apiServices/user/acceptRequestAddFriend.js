import instance from "~/instanceAxios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function acceptRequestAddFriend(requestId) {
  return await instance.post(
    `/acceptfriend/${requestId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
      },
    }
  );
}
