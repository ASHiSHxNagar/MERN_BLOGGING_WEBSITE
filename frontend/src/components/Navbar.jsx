import React, { useContext } from "react";
import logo from "../imgs/logo.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { UserContext } from "../App";
import UserNavigation from "./UserNavigation";

const Navbar = () => {
  const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);

  let navigate = useNavigate();

  const handleUserNavPanel = () => {
    setUserNavPanel((currentVal) => !currentVal);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setUserNavPanel(false);
    }, 200);
  };

  const handleSearch = (e) => {
    let query = e.target.value;

    if (e.keyCode === 13 && query == "") {
      navigate("/");
    }

    if (e.keyCode === 13 && query.length) {
      navigate(`/search/${query}`);
    }
  };

  const { userAuth } = useContext(UserContext); // Ensure userAuth is retrieved correctly
  const { access_token, profile_img } = userAuth || {}; // Handle case where userAuth might be undefined

  return (
    <>
      <nav className="z-10 sticky top-0 flex items-center gap-12 w-full px-[5vw] py-5 h-[80px] border-b border-gray-300 bg-white">
        <Link to="/" className="flex-none w-10">
          <img src={logo} className="w-full" />
        </Link>

        <div
          className={
            `absolute bg-white w-full left-0 top-full mt-0.5  border-b border-grey  py-4 px-[5vw] mx-1md:border-0 md:block md:relative md:inset-0 md:p-0  md:w-auto md:show  ` +
            (searchBoxVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full  md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            onKeyDown={handleSearch}
          />
          <i className="fi fi-rr-search absolute right-[10%]  md:pointer-events-none  md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey "></i>
        </div>

        <div className="flex items-center gap-3 ml-auto md:gap-6">
          <button
            className="flex items-center justify-center w-12 h-12 rounded-full md:hidden bg-grey"
            onClick={() => setSearchBoxVisibility((currentVal) => !currentVal)}
          >
            <i className="pt-1 text-xl fi fi-rr-search"></i>
          </button>

          <Link to="/editor" className="hidden gap-2 rounded-full md:flex link">
            <i className="fi fi-rr-file-edit"></i>
            <p>Write</p>
          </Link>
          {access_token ? (
            <>
              <Link to="/dashboard/notification">
                <button className="relative w-12 h-12 rounded-full bg-grey hover:bg-black/10">
                  <i className="block mt-1 text-2xl fi fi-rr-bell"></i>
                </button>
              </Link>

              <div
                className="relative"
                onClick={handleUserNavPanel}
                onBlur={handleBlur}
              >
                <button className="w-12 h-12 mt-1">
                  <img
                    src={profile_img}
                    className="object-cover w-full h-full rounded-full "
                  />
                </button>
              </div>
              {userNavPanel ? <UserNavigation /> : ""}
            </>
          ) : (
            <>
              <Link className="py-2 btn-dark" to="/signin">
                {" "}
                Sign In{" "}
              </Link>
              <Link className="hidden py-2 btn-light md:block" to="/signup">
                {" "}
                Sign Up{" "}
              </Link>
            </>
          )}
        </div>
      </nav>

          
      <Outlet />
    </>
  );
};

export default Navbar;
