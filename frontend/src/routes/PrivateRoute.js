import { Navigate } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export const PrivateRoute = ({ children }) => {
  let isAuthenticated;
  if (cookies.get("token")) isAuthenticated = true;
  else isAuthenticated = false;

  if (isAuthenticated) {
    return children;
  }

  return <Navigate to="/login" />;
};
