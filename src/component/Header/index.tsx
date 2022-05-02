import { useEffect, useState } from "react";
import Login from "../../pages/Login";
import Button from "../Button";
import DropdownButton from "../DropdownButton";
import { useLocation, Link } from "react-router-dom";
import "./header.scss";

const loginRes = [
  {
    id: 1,
    value: "Email",
    disable: true,
  },
  {
    id: 2,
    value: "Logout",
  },
];

export default function Header() {
  const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
  const [isLoggedin, setIsLoggedIn] = useState<boolean>(false);
  const [location, setLocation] = useState<string>(window.location.pathname);
  const { pathname }: any = useLocation();

  useEffect(() => {
    const loginStatus = Boolean(localStorage.getItem("isLogin"));
    const Email = localStorage.getItem("email");
    loginRes[0].value = Email || "";
    setIsLoggedIn(loginStatus);
  }, [openLoginModal]);

  useEffect(() => {
    setLocation(pathname);
  }, [pathname]);

  return (
    <div className="stickyContainer">
      <div className="header">
        <ul>
          <li>
            <Link className={`${location === "/" ? "active" : ""}`} to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className={location === "/trade" ? "active" : ""} to="/trade">
              Trade
            </Link>
          </li>
          <li>
            {isLoggedin ? (
              <DropdownButton
                options={loginRes}
                defaultvalue="Profile"
                customDropdownStyles="optionStyle"
              />
            ) : (
              <Button onClick={() => setOpenLoginModal(true)} label="Login" />
            )}
          </li>
        </ul>
      </div>
      <Login
        modalVisible={openLoginModal}
        closeModal={() => setOpenLoginModal(false)}
      />
    </div>
  );
}
