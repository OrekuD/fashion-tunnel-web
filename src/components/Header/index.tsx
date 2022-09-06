import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import colors from "../../constants/colors";
import { useWindowResize } from "../../hooks/useWindowResize";
import { uiActions } from "../../store/slices/ui.slice";
import Cart from "../Cart";
import { CartIcon, Logo, MenuIcon } from "../Icons";
import ProfileMenu from "../ProfileMenu";
import classes from "./index.module.scss";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSmallerDevice } = useWindowResize();

  return (
    <>
      <Cart />
      <ProfileMenu />
      <header className={classes["header"]}>
        {/* <button className={classes["menu"]}>
          <MenuIcon width={24} height={24} color={colors.deepgrey} />
        </button> */}
        <Link to="/home" className={classes["logo"]}>
          <Logo scale={1.8} color={colors.deepgrey} />
        </Link>
        <div className={classes["right-section"]}>
          <button
            onClick={() =>
              dispatch(uiActions.setCartModalState({ isVisible: true }))
            }
          >
            <CartIcon width={24} height={24} color={colors.deepgrey} />
          </button>
          <button
            onClick={() => {
              if (isSmallerDevice) {
                dispatch(uiActions.setProfileModalState({ isVisible: true }));
              } else {
                navigate("/profile/account");
              }
            }}
          >
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8bW9kZWx8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60"
              alt="profile-image"
              className={classes["profile-image"]}
            />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
