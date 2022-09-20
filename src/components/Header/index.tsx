import React from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import colors from "../../constants/colors";
import { useWindowResize } from "../../hooks/useWindowResize";
import { useSelectState } from "../../store/selectors";
import { uiActions } from "../../store/slices/ui.slice";
import Cart from "../Cart";
import { CartIcon, Logo, MenuIcon } from "../Icons";
import ProfileMenu from "../ProfileMenu";
import classes from "./index.module.scss";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSmallerDevice } = useWindowResize();
  const { cart, user } = useSelectState();
  const { pathname } = useLocation();
  const [isScrollTop, setIsScrollTop] = React.useState(true);

  // const menu = React.useMemo(
  //   () => [
  //     { label: "home", to: "/home" },
  //     { label: "explore", to: "/explore" },
  //     { label: "categories", to: "/categories" },
  //     { label: "profile", to: "/profile/account" },
  //   ],
  //   []
  // );

  const menu = React.useMemo(
    () => [
      { label: "home", onClick: () => navigate("/home") },
      { label: "explore", onClick: () => navigate("/explore") },
      { label: "categories", onClick: () => navigate("/categories") },
      {
        label: "profile",
        onClick: () => {
          if (isSmallerDevice) {
            dispatch(uiActions.setProfileModalState({ isVisible: true }));
          } else {
            navigate("/profile/account");
          }
        },
      },
    ],
    []
  );

  const links = () => (
    <>
      <div className={classes["menu"]}>
        {menu.map(({ label, onClick }, index) => {
          const isActive = pathname.includes(label);
          return (
            <button
              key={index}
              onClick={onClick}
              className={classes["menu-item"]}
            >
              <p>{label}</p>
              <div
                className={classes["indicator"]}
                style={{ width: isActive ? "50%" : undefined }}
              />
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      <Cart />
      <ProfileMenu />
      <header
        onScroll={(e) => {
          if ((e.target as any)?.scrollTop === 0) {
            setIsScrollTop(true);
            console.log("to top");
          } else {
            setIsScrollTop(false);
            console.log("no to top");
          }
        }}
        className={classes["header"]}
        style={{
          boxShadow: isScrollTop
            ? undefined
            : " 6.7px 6.7px 5.3px rgba(0, 0, 0, 0.028), 22.3px 22.3px 17.9px rgba(0, 0, 0, 0.042), 100px 100px 80px rgba(0, 0, 0, 0.07)",
        }}
      >
        <div className={classes["top-section"]}>
          <Link to="/home" className={classes["logo"]}>
            <Logo scale={1.8} color={colors.deepgrey} />
          </Link>
          <div className={classes["desktop"]}>{links()}</div>
          <div className={classes["right-section"]}>
            <button
              onClick={() =>
                dispatch(uiActions.setCartModalState({ isVisible: true }))
              }
              className={classes["cart-icon"]}
            >
              {cart.products.length > 0 && (
                <div className={classes["cart-count"]}>
                  <p>{cart.products.length}</p>
                </div>
              )}
              <CartIcon width={32} height={32} color={colors.deepgrey} />
            </button>
          </div>
        </div>
        <div className={classes["mobile"]}>{links()}</div>
      </header>
    </>
  );
};

export default Header;
