import classNames from "classnames/bind";
import Cookies from "universal-cookie";
import { useState } from "react";
import styles from "./Signup.module.scss";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "~/apiServices/user/signup";

const cx = classNames.bind(styles);

function Signup() {
  const [givenName, setGivenName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [againPassword, setAgainPassword] = useState("");
  const [error, setError] = useState(false);

  const cookies = new Cookies();

  const navigate = useNavigate();

  const handleOnchange = (e, setFunc) => {
    setFunc(e.target.value);
  };

  const handleSubmit = () => {
    const fetchApi = async () => {
      try {
        const res = await signup(givenName, surname, email, password);
        cookies.set("token", res.data.token);
        cookies.set("id", res.data.id);
        navigate("/");
      } catch (e) {
        setError(true);
      }
    };

    if (
      givenName.trim() === "" ||
      surname.trim() === "" ||
      password.trim() === "" ||
      againPassword.trim() === "" ||
      email.trim() === "" ||
      password !== againPassword
    ) {
      setError(true);
    } else {
      fetchApi();
    }
  };

  return (
    <div className={cx("container")}>
      <div className={cx("signup-wrapper")}>
        <div className={cx("signup-left")}>
          <span className={cx("logo")}>Tanhsocial</span>
          <span className={cx("desc")}>
            Connect with friend and the world around you on Tanhsocial
          </span>
        </div>
        <div className={cx("signup-right")}>
          <div className={cx("signup-form")}>
            {error && <p className={cx("error")}>Error</p>}
            <div className={cx("double-input")}>
              <input
                className={cx("signup-input")}
                type="text"
                placeholder="Given name"
                onChange={(e) => handleOnchange(e, setGivenName)}
              />
              <input
                className={cx("signup-input")}
                type="text"
                placeholder="Surname"
                onChange={(e) => handleOnchange(e, setSurname)}
              />
            </div>
            <input
              className={cx("signup-input")}
              type="text"
              placeholder="Email"
              onChange={(e) => handleOnchange(e, setEmail)}
            />
            <input
              className={cx("signup-input")}
              type="password"
              placeholder="Password"
              onChange={(e) => handleOnchange(e, setPassword)}
            />
            <input
              className={cx("signup-input")}
              type="password"
              placeholder="Password Again"
              onChange={(e) => handleOnchange(e, setAgainPassword)}
            />
            <button className={cx("signup-btn")} onClick={handleSubmit}>
              Sign Up
            </button>
            <Link to="/login" className={cx("register-btn")}>
              Log into Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
