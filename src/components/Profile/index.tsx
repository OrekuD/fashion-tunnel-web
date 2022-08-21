import React from "react";
import classes from "./index.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/slices/ui.slice";
import { useSelectState } from "../../store/selectors";
import { cedi, ease } from "../../constants";
import { CancelIcon } from "../Icons";
import colors from "../../constants/colors";
import Button from "../Button";
import CartItem from "../CartItem";
import { useLocation } from "react-router-dom";
import { authenticationActions } from "../../store/slices/authentication.slice";
import authentictionAsyncActions from "../../store/actions/authentication.action";
import ProductCard from "../ProductCard";

interface Props {}

const Profile = (props: Props) => {
  const dispatch = useDispatch();
  const { ui, user, authentication, favourites } = useSelectState();
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = React.useState(0);

  React.useEffect(() => {
    dispatch(uiActions.setProfileModalState({ isVisible: false }));
  }, [pathname]);

  const menu = [
    {
      label: "personal details",
      onClick: () => {
        setActiveTab(0);
      },
      component: (
        <>
          <p>personal details</p>
          {Array(10)
            .fill("0")
            .map((_, index) => (
              <div
                key={index}
                style={{
                  width: 200,
                  height: 200,
                  marginBottom: 10,
                  background: "red",
                }}
              />
            ))}
        </>
      ),
    },
    {
      label: "favourite items",
      onClick: () => {
        setActiveTab(1);
      },
      component: (
        <>
          <p>favorite </p>
          <div className={classes["list"]}>
            {favourites.list.map((product) => (
              <ProductCard product={product} key={product.id} />
            ))}
          </div>
        </>
      ),
    },
    {
      label: "past orders",
      onClick: () => {
        setActiveTab(2);
      },
      component: (
        <>
          <p>past orders</p>
        </>
      ),
    },
  ];

  return (
    <AnimatePresence initial={false}>
      {ui.isProfileVisible ? (
        <>
          <motion.div
            className={classes["modal-backdrop"]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className={classes["modal-content"]}
            initial={{ translateX: "75vw" }}
            animate={{
              translateX: 0,
              transition: {
                ease: ease,
              },
            }}
            exit={{ translateX: "75vw" }}
          >
            <div className={classes["left-content"]}>
              <p className={classes["title"]}>My account</p>
              <p className={classes["name"]}>
                {`${user.firstname} ${user.lastname}`}
              </p>
              <div className={classes["menu"]}>
                {/* {menu.map(({label, onPress}, index) => ()} */}
                {menu.map(({ label, onClick }, index) => {
                  const isActive = index === activeTab;
                  return (
                    <button
                      key={index}
                      onClick={onClick}
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
                    dispatch(authentictionAsyncActions.signout());
                  }}
                  className={`${classes["menu-item"]} ${classes["last"]}`}
                >
                  <p>logout</p>
                  <div
                    className={classes["indicator"]}
                    // style={{ width: isActive ? "100%" : undefined }}
                  />
                </button>
              </div>
            </div>
            <div className={classes["right-content"]}>
              <button
                onClick={() =>
                  dispatch(uiActions.setProfileModalState({ isVisible: false }))
                }
                className={classes["close-button"]}
              >
                <CancelIcon width={32} height={32} color={colors.deepgrey} />
              </button>
              <div className={classes["component"]}>
                {menu[activeTab].component}
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default Profile;
