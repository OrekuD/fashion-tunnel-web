import React from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import colors from "../../constants/colors";
import { useWindowResize } from "../../hooks/useWindowResize";
import { useSelectState } from "../../store/selectors";
import { uiActions } from "../../store/slices/ui.slice";
import Cart from "../Cart";
import { CartIcon, HeartIcon, Logo, MenuIcon } from "../Icons";
import ProfileMenu from "../ProfileMenu";
import classes from "./index.module.scss";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSmallerDevice } = useWindowResize();
  const { cart, authentication } = useSelectState();
  const { pathname } = useLocation();

  // const menu = React.useMemo(
  //   () => [
  //     { label: "home", to: "/home" },
  //     { label: "explore", to: "/explore" },
  //     { label: "categories", to: "/categories" },
  //     { label: "profile", to: "/profile/account" },
  //   ],
  //   []
  // );

  // const menu = React.useMemo(
  //   () => [
  //     { label: "home", onClick: () => navigate("/home") },
  //     { label: "explore", onClick: () => navigate("/explore") },
  //     { label: "categories", onClick: () => navigate("/categories") },
  //     {
  //       label: "profile",
  //       onClick: () => {
  //         if (isSmallerDevice) {
  //           dispatch(uiActions.setProfileModalState({ isVisible: true }));
  //         } else {
  //           navigate("/profile/account");
  //         }
  //       },
  //     },
  //   ],
  //   []
  // );

  const menu = React.useMemo(() => {
    const links = [
      { label: "home", value: "home", onClick: () => navigate("/home") },
      {
        label: "explore",
        value: "explore",
        onClick: () => navigate("/explore"),
      },
      {
        label: "categories",
        value: "categories",
        onClick: () => navigate("/categories"),
      },
    ];

    if (authentication.isAuthenticated) {
      links.push({
        label: "profile",
        value: "profile",
        onClick: () => {
          if (isSmallerDevice) {
            dispatch(uiActions.setProfileModalState({ isVisible: true }));
          } else {
            navigate("/profile/account");
          }
        },
      });
    } else {
      links.push({
        label: "sign in",
        value: "sign-in",
        onClick: () => {
          navigate("/sign-in");
        },
      });
    }

    return links;
  }, [authentication.isAuthenticated]);

  const links = () => (
    <>
      <div className={classes["menu"]}>
        {menu.map(({ label, onClick, value }, index) => {
          const isActive =
            value === "sign-in" && pathname === "/sign-up"
              ? true
              : pathname.includes(value);
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
      <header className={classes["header"]}>
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
              <CartIcon width={30} height={30} color={colors.deepgrey} />
            </button>
            <button
              onClick={() => navigate("/wishlist")}
              className={classes["heart-icon"]}
            >
              <HeartIcon width={30} height={30} color={colors.deepgrey} />
            </button>
          </div>
        </div>
        <div className={classes["mobile"]}>{links()}</div>
      </header>
    </>
  );
};

export default Header;
