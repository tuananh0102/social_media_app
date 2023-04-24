import instance from "~/instanceAxios";

export async function signup(givenname, surname, email, password) {
  return await instance.post("/register", {
    email: email,
    password: password,
    given_name: givenname,
    surname: surname,
  });
}
