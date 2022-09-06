import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { ease } from "../../constants";
import colors from "../../constants/colors";
import authenticationAsyncActions from "../../store/actions/authentication.action";
import { useSelectState } from "../../store/selectors";
import { uiActions } from "../../store/slices/ui.slice";
import { CancelIcon } from "../Icons";
import classes from "./index.module.scss";

const ProfileMenu = () => {
  const dispatch = useDispatch();
  const { ui, user } = useSelectState();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    dispatch(uiActions.setProfileModalState({ isVisible: false }));
  }, [pathname]);

  const menu = React.useMemo(
    () => [
      {
        label: "account details",
        to: "/profile/account",
      },
      {
        label: "orders",
        to: "/profile/orders",
      },
      {
        label: "address book",
        to: "/profile/address-book",
      },
    ],
    []
  );

  return (
    <AnimatePresence>
      {ui.isProfileModalVisible ? (
        <>
          <motion.div
            className={classes["modal-backdrop"]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={classes["modal-menu"]}
            initial={{ translateX: "100%" }}
            animate={{
              translateX: 0,
              transition: {
                ease,
              },
            }}
            exit={{ translateX: "100%" }}
          >
            <button
              onClick={() =>
                dispatch(uiActions.setProfileModalState({ isVisible: false }))
              }
              className={classes["close-button"]}
            >
              <CancelIcon width={24} height={24} color={colors.deepgrey} />
            </button>
            <p className={classes["title"]}>My account</p>
            <p className={classes["name"]}>
              {`${user.firstname} ${user.lastname}`}
            </p>
            <div className={classes["menu"]}>
              {menu.map(({ label, to }, index) => {
                const isActive = pathname.includes(to);
                return (
                  <button
                    key={index}
                    onClick={() => {
                      navigate(to);
                    }}
                    className={classes["menu-item"]}
                  >
                    <p>{label}</p>
                    <div
                      className={classes["indicator"]}
                      style={{ width: isActive ? "100%" : undefined }}
                    />
                  </button>
                );
              })}
              <button
                onClick={() => {
                  dispatch(authenticationAsyncActions.signout());
                }}
                className={`${classes["menu-item"]} ${classes["last"]}`}
              >
                <p>logout</p>
                <div className={classes["indicator"]} />
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default ProfileMenu;
