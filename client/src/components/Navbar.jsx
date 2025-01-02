import { Fragment, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import axios from "axios";

// Importing components and context
import { useStateContext } from "../contexts/GlobalContext";
import Logo from "./Logo"; // Import the new Logo component
import UserNavigationPanel from "./UserNavigationPanel";

// functions
import { setSession } from "../functions/session";

// assets
import { logoDark, logoLight } from "../assets";

const Navbar = () => {
  const [searchboxVisibility, setSearchBoxVisibility] = useState(false);
  const [userNavPanel, setUserNavPanel] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const {
    userData,
    userData: { access_token, profile_img, new_notification_available },
    updateUserData,
    theme,
    setTheme,
    categories = [], // Default to empty array if categories is undefined
  } = useStateContext();

  const changeTheme = () => {
    let newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);

    document.body.setAttribute("data-theme", newTheme);

    setSession("theme", newTheme);
  };

  const handleUserNavPanel = () => {
    setUserNavPanel((current) => !current);
  };

  const handleBlur = () => {
    setTimeout(() => setUserNavPanel(false), 200);
  };

  // search
  const handleSearch = (event) => {
    const query = event.target.value;

    if (event.keyCode === 13 && query.length) {
      navigate(`/search/${query}`);
    }
  };

  useEffect(() => {
    if (access_token) {
      axios
        .get(`/api/v1/notifications/new`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
        .then(({ data }) => {
          updateUserData({
            type: "LOGIN",
            payload: { ...userData, ...data },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [access_token]);

  // Safely handle categories if they exist
  const mainCategories = Array.isArray(categories)
    ? categories.slice(0, 5)
    : [];
  const moreCategories = Array.isArray(categories) ? categories.slice(5) : [];

  return (
    <Fragment>
      <nav className="navbar z-50 px-4 py-2 bg-white dark:bg-gray-800 flex items-center justify-between">
        {/* Replace old logo implementation with the new Logo component */}
        <Logo to="/" className="flex-none w-20" />

        {/* Search Box */}
        <div
          className={
            "absolute bg-white w-full left-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show " +
            (searchboxVisibility ? "show" : "hide")
          }
        >
          <input
            type="text"
            placeholder="Search"
            className="w-full md:w-auto bg-grey p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
            onKeyDown={handleSearch}
          />
          <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
        </div>

        {/* Categories and User Features */}
        <div className="flex items-center gap-3 md:gap-6 ml-auto">
          {/* Toggle Search */}
          <button
            className="md:hidden bg-grey w-12 h-12 rounded-full flex items-center justify-center"
            onClick={() => setSearchBoxVisibility((current) => !current)}
          >
            <i className="fi fi-rr-search text-xl"></i>
          </button>

          {/* Write Button */}
          <Link to="/editor" className="hidden md:flex gap-2 link">
            <i className="fi fi-rr-file-edit"></i>
            <p>Write</p>
          </Link>

          {/* Theme Switch Button */}
          <button
            className={`w-12 h-12 rounded-full ${
              theme === "dark"
                ? "bg-grey hover:bg-dark-grey"
                : "bg-grey hover:bg-black/20"
            }`}
            onClick={changeTheme}
          >
            <i
              className={`fi fi-rr-${
                theme === "light" ? "moon-stars" : "sun"
              } text-2xl block mt-1`}
            ></i>
          </button>

          {/* Categories */}
          <div className="hidden md:flex gap-4">
            {mainCategories.map((category) => (
              <Link
                key={category}
                to={`/category/${category}`}
                className="link"
              >
                {category}
              </Link>
            ))}
            {moreCategories.length > 0 && (
              <div className="relative">
                <button
                  className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/20"
                  onClick={() => setDropdownOpen((prev) => !prev)}
                >
                  <i className="fi fi-rr-menu-dots text-xl block mt-1"></i>
                </button>
                {dropdownOpen && (
                  <div className="absolute bg-white shadow-lg rounded-lg w-40 right-0 top-full mt-2">
                    {moreCategories.map((category) => (
                      <Link
                        key={category}
                        to={`/category/${category}`}
                        className="block px-4 py-2 text-black hover:bg-grey-100"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* User Profile and Notifications */}
          {access_token ? (
            <>
              <Link to="/dashboard/notifications">
                <button className="w-12 h-12 rounded-full bg-grey relative hover:bg-black/20">
                  <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                  {new_notification_available && (
                    <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                  )}
                </button>
              </Link>

              <div
                className="relative"
                onClick={handleUserNavPanel}
                onBlur={handleBlur}
              >
                <button className="w-12 h-12 mt-1">
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={profile_img}
                    alt="user"
                  />
                </button>

                {userNavPanel && <UserNavigationPanel />}
              </div>
            </>
          ) : (
            <>
              <Link to="/signin" className="btn-dark py-2">
                Sign In
              </Link>
              <Link to="/signup" className="btn-light py-2 hidden md:block">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Footer with About, Contact, Terms, Privacy */}
      <div
        className={`${
          theme === "dark"
            ? "bg-gray-900 white"
            : "bg-gray-100 text-gray-800"
        } py-4`}
      >
        <div className="flex justify-center space-x-6">
          <Link to="/about" className="hover:underline">
            About
          </Link>
          <Link to="/contact" className="hover:underline">
            Contact
          </Link>
          <Link to="/terms" className="hover:underline">
            Terms
          </Link>
          <Link to="/privacy" className="hover:underline">
            Privacy
          </Link>
        </div>
      </div>

      <Outlet />
    </Fragment>
  );
};

export default Navbar;
