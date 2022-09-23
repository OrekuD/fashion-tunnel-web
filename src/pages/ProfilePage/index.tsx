import classes from "./index.module.scss";
import React from "react";
import { useDispatch } from "react-redux";
import { useSelectState } from "../../store/selectors";
import {
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import authenticationAsyncActions from "../../store/actions/authentication.action";
import ChangePasswordView from "./ChangePasswordView";
import AddNewAddressView from "./AddNewAddressView";
import EditAddressView from "./EditAddressView";
import AddressBookView from "./AddressBookView";
import UserDetailsView from "./UserDetailsView";
import OrdersView from "./OrdersView";
import Header from "../../components/Header";
import { AnimatePresence, motion } from "framer-motion";
import { ease } from "../../constants";
import ProfilePictureView from "./ProfilePictureView";
import Loader from "../../components/Loader";
import colors from "../../constants/colors";
import RequestManager from "../../store/request-manager";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ui, user, request } = useSelectState();
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(authenticationAsyncActions.signout.typePrefix)) {
      RM.consume(authenticationAsyncActions.signout.typePrefix);
      setIsLoading(false);
      navigate("/home");
      return;
    }

    if (RM.isRejected(authenticationAsyncActions.signout.typePrefix)) {
      RM.consume(authenticationAsyncActions.signout.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

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
    <div className={classes["container"]}>
      <div className={classes["left-content"]}>
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
              setIsLoading(true);
              dispatch(authenticationAsyncActions.signout());
            }}
            className={`${classes["menu-item"]} ${classes["last"]}`}
          >
            {isLoading ? (
              <Loader color={colors.deepgrey} />
            ) : (
              <>
                <p>logout</p>
                <div className={classes["indicator"]} />
              </>
            )}
          </button>
        </div>
      </div>
      <div className={classes["right-content"]}>
        <div className={classes["component"]}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  React.useEffect(() => {
    if (pathname === "/profile") {
      navigate("/profile/account");
    }
    // console.log({ pathname });
  }, []);
  return (
    <>
      <Header />
      <Routes>
        <Route path="" element={<Layout />}>
          <Route path="account" element={<UserDetailsView />} />
          <Route path="account/security" element={<ChangePasswordView />} />
          <Route
            path="account/profile-image"
            element={<ProfilePictureView />}
          />
          <Route path="orders" element={<OrdersView />} />
          <Route
            path="address-book/edit/:addressId"
            element={<EditAddressView />}
          />
          <Route path="address-book/create" element={<AddNewAddressView />} />
          <Route path="orders" element={<OrdersView />} />
          <Route path="orders" element={<OrdersView />} />
          <Route path="address-book" element={<AddressBookView />} />
        </Route>
      </Routes>
    </>
  );
};

export default ProfilePage;
