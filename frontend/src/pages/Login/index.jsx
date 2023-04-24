import classNames from "classnames/bind";
import Cookies from "universal-cookie";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.scss";
import { useContext, useRef, useState } from "react";
import { login } from "~/apiServices/user/login";
import { UserContext } from "~/contexts";
import { getUserById } from "~/apiServices/user/getUserById";

const cx = classNames.bind(styles);

function Login() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleOnchange = (e, setFunc) => {
    setFunc(e.target.value);
  };

  const handleSubmit = () => {
    const fetchApi = async () => {
      try {
        const res = await login(email, password);

        cookies.set("token", res.data.token);
        cookies.set("id", res.data.id);
        const resUser = await getUserById(cookies.get("id"));
        setCurrentUser(resUser.data);
        navigate("/");
      } catch (e) {
        setError(true);
      }
    };

    if (email.trim() != "" && password.trim() != "") {
      fetchApi();
    }
  };
  return (
    <div className={cx("container")}>
      <div className={cx("login-wrapper")}>
        <div className={cx("login-left")}>
          <span className={cx("logo")}>Tanhsocial</span>
          <span className={cx("desc")}>
            Connect with friend and the world around you on Tanhsocial
          </span>
        </div>
        <div className={cx("login-right")}>
          <div className={cx("login-form")}>
            {error && <h4 className={cx("error")}>Error</h4>}
            <input
              className={cx("login-input")}
              type="email"
              placeholder="Email"
              onChange={(e) => {
                handleOnchange(e, setEmail);
              }}
            />
            <input
              className={cx("login-input")}
              type="password"
              placeholder="Password"
              onChange={(e) => handleOnchange(e, setPassword)}
            />
            <button className={cx("login-btn")} onClick={handleSubmit}>
              Log In
            </button>
            <span className={cx("forgot-btn")}>Forgot Password?</span>
            <Link to="/signup" className={cx("register-btn")}>
              Create a New Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
