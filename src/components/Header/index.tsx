import React from "react";
import { Link } from "react-router-dom";
import colors from "../../constants/colors";
import { CartIcon, Logo } from "../Icons";
import classes from "./index.module.scss";

const Header = () => {
  return (
    <header className={classes["header"]}>
      <div className={classes["left-section"]}></div>
      <Link to="/home">
        <Logo scale={1.8} color={colors.deepgrey} />
      </Link>
      <div className={classes["right-section"]}>
        <Link to="#">
          <CartIcon width={24} height={24} color={colors.deepgrey} />
        </Link>
        <Link to="#">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZWx8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
            alt="profile-image"
            className={classes["profile-image"]}
          />
        </Link>
      </div>
    </header>
  );
};

export default Header;
