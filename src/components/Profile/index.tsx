import React from "react";
import classes from "./index.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch } from "react-redux";
import { uiActions } from "../../store/slices/ui.slice";
import { useSelectState } from "../../store/selectors";
import { cedi, ease } from "../../constants";
import {
  CancelIcon,
  ChevronRightIcon,
  EditIcon,
  EyeCancelIcon,
  EyeIcon,
  MailIcon,
  TrashIcon,
  UserIcon,
} from "../Icons";
import colors from "../../constants/colors";
import Button from "../Button";
import CartItem from "../CartItem";
import { useLocation } from "react-router-dom";
import { authenticationActions } from "../../store/slices/authentication.slice";
import authentictionAsyncActions from "../../store/actions/authentication.action";
import ProductCard from "../ProductCard";
import TextInput from "../TextInput";
import RequestManager from "../../store/request-manager";
import userAsyncActions from "../../store/actions/user.action";
import isAnyEmpty from "../../utils/isAnyEmpty";
import UpdateUserRequest from "../../network/requests/UpdateUserRequest";
import ChangePasswordRequest from "../../network/requests/ChangePasswordRequest";
import userAddressAsyncActions from "../../store/actions/userAddress.action";
import ordersAsyncActions from "../../store/actions/orders.action";
import ChangePasswordView from "./ChangePasswordView";
import AddNewAddressView from "./AddNewAddressView";
import RadioButton from "../RadioButton";
import { userAddressActions } from "../../store/slices/userAddress.slice";
import EditAddressView from "./EditAddressView";
import AddressBookView from "./AddressBookView";
import UserDetailsView from "./UserDetailsView";
import OrdersView from "./OrdersView";

const Profile = () => {
  const dispatch = useDispatch();
  const { ui, user, authentication, favourites, request, userAddress } =
    useSelectState();
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = React.useState(1);
  const [emailError, setEmailError] = React.useState("");
  const [firstName, setFirstName] = React.useState(user?.firstname || "");
  const [lastName, setLastName] = React.useState(user?.lastname || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [passwordError, setPasswordError] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(true);
  const [showNewPassword, setShowNewPassword] = React.useState(true);
  const [showPasswordView, setShowPasswordView] = React.useState(false);
  const [showAddNewAddressView, setShowAddNewAddressView] =
    React.useState(false);
  const [showEditAddressView, setShowEditAddressView] = React.useState(false);
  const [selectedAddressId, setSelectedAddressId] = React.useState("");
  const [isDeleting, setIsDeleting] = React.useState(false);

  const [isLoading, setIsLoading] = React.useState(false);
  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    dispatch(userAddressAsyncActions.index());
    dispatch(ordersAsyncActions.index());
  }, []);

  // React.useEffect(() => {
  //   dispatch(uiActions.setProfileModalState({ isVisible: false }));
  // }, [pathname]);

  const menu = [
    {
      label: "orders",
      onClick: () => {
        setActiveTab(0);
      },
      component: <OrdersView />,
    },
    {
      label: "account details",
      onClick: () => {
        setActiveTab(2);
      },
      component: <UserDetailsView setShowPasswordView={setShowPasswordView} />,
    },
    {
      label: "address book",
      onClick: () => {
        setActiveTab(3);
      },
      component: (
        <AddressBookView
          setSelectedAddressId={setSelectedAddressId}
          setShowAddNewAddressView={setShowAddNewAddressView}
          setShowEditAddressView={setShowEditAddressView}
        />
      ),
    },
  ];

  const content = React.useMemo(() => {
    switch (activeTab) {
      case 0:
        return menu[0].component;

      case 1:
        if (showPasswordView) {
          return (
            <ChangePasswordView goBack={() => setShowPasswordView(false)} />
          );
        } else {
          return menu[1].component;
        }

      case 2:
        if (showAddNewAddressView) {
          return (
            <AddNewAddressView goBack={() => setShowAddNewAddressView(false)} />
          );
        }
        if (showEditAddressView) {
          return (
            <EditAddressView
              selectedAddressId={selectedAddressId}
              goBack={() => setShowEditAddressView(false)}
            />
          );
        }

        return menu[2].component;

      default:
        return <></>;
    }
  }, [activeTab, showAddNewAddressView, showPasswordView, menu]);

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
                      onClick={() => {
                        setActiveTab(index);
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
                {/* {menu[activeTab].component} */}
                {/* {showPasswordView ? (
                  <>{passwordView}</>
                ) : (
                  <>{menu[activeTab].component}</>
                )} */}
                {content}
              </div>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default Profile;
