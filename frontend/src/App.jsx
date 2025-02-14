import { Routes, Route } from "react-router-dom";
import "../src/index.css";
import Navbar from "./components/Navbar";
import UserAuthForm from "./pages/UserAuthForm";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/Session";
import Editor from "./pages/Editor";
import HomePage from "./pages/Home";
import Search from "./pages/Search";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let userInSession = lookInSession("user");

    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ access_token: null });
  }, []);

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<Editor />} />
        {/* home router navbar to show on all pages */}
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="signin" element={<UserAuthForm type="sign-in" />} />
          <Route path="signup" element={<UserAuthForm type="sign-up" />} />
          <Route path="search/:query" element={<Search />} />
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
