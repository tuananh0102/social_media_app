import instance from "~/instanceAxios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
export async function createRequestAddFriend(acceptId) {
  return await instance.post(
    `/addfriend/${acceptId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${cookies.get("token")}`,
      },
    }
  );
}
