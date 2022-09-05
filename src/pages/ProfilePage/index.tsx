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
import authentictionAsyncActions from "../../store/actions/authentication.action";
import ChangePasswordView from "./ChangePasswordView";
import AddNewAddressView from "./AddNewAddressView";
import EditAddressView from "./EditAddressView";
import AddressBookView from "./AddressBookView";
import UserDetailsView from "./UserDetailsView";
import OrdersView from "./OrdersView";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { ui, user } = useSelectState();
  const { pathname } = useLocation();

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
              dispatch(authentictionAsyncActions.signout());
            }}
            className={`${classes["menu-item"]} ${classes["last"]}`}
          >
            <p>logout</p>
            <div className={classes["indicator"]} />
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
  return (
    <Routes>
      <Route path="" element={<Layout />}>
        <Route path="account" element={<UserDetailsView />} />
        <Route path="account/security" element={<ChangePasswordView />} />
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
  );
};

export default ProfilePage;
