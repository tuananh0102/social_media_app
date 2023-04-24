import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import TopBar from "~/components/TopBar";
import Home from "~/pages/Home";
import Profile from "~/pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Cookies from "universal-cookie";
import { getUserById } from "~/apiServices/user/getUserById";

import { RequestAddFriendNotifyContext, UserContext } from "./contexts";
import { getRequestAddFriend } from "./apiServices/user/getRequestAddFriend";

// cookies.remove("token");
// console.log(cookies.get("token"));
function App() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState({});
  const [requestAddFriend, setRequestAddFriend] = useState([]);
  const cookies = new Cookies();
  useEffect(() => {
    console.log("app ", cookies.get("id"));
    const fetchApi = async () => {
      try {
        const res = await getUserById(cookies.get("id"));
        setCurrentUser(res.data);
        await fetchRequestAddFriendApi();
      } catch (e) {
        navigate("/login");
      }
    };

    const fetchRequestAddFriendApi = async () => {
      try {
        const res = await getRequestAddFriend();
        setRequestAddFriend(res.data);
      } catch (e) {
        setRequestAddFriend([]);
      }
    };
    fetchApi();
    // fetchRequestAddFriendApi();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {/* <Router> */}
      <RequestAddFriendNotifyContext.Provider
        value={{ requestAddFriend, setRequestAddFriend }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:id" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      </RequestAddFriendNotifyContext.Provider>
      {/* </Router> */}
    </UserContext.Provider>
  );
}

export default App;
