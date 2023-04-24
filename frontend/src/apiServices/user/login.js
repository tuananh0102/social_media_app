import instance from "~/instanceAxios";

export async function login(email, password) {
  return await instance.post("/login", {
    email: email,
    password: password,
  });
}
