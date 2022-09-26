import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelectState } from "./store/selectors";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import CheckoutPage from "./pages/CheckoutPage";
import { useDispatch } from "react-redux";
import { AxiosResponse } from "axios";
import API from "./constants/api";
import authenticationAsyncActions from "./store/actions/authentication.action";
import OrderPage from "./pages/OrderPage";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";
import CategoryPage from "./pages/CategoryPage";
import SearchPage from "./pages/SearchPage";
import WishlistPage from "./pages/WishlistPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import EnterCodePage from "./pages/EnterCodePage";

const App = () => {
  const { authentication } = useSelectState();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const launch = async () => {
      API.client.interceptors.response.use(
        (response: AxiosResponse<any>): AxiosResponse<any> => response,
        (error: any) => {
          if (error.response) {
            if (error.response.status === 403) {
              dispatch(authenticationAsyncActions.signout());
            }
          } else if (error.status) {
            if (error.status === 403) {
              dispatch(authenticationAsyncActions.signout());
            }
          }

          return Promise.reject(error);
        }
      );

      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        API.addAccessToken(accessToken);
      }
    };

    launch().then(() => {});
  }, []);

  return (
    <div className={"app-main-container"}>
      <Routes>
        <Route path="home" element={<HomePage />} />
        <Route path="checkout" element={<CheckoutPage />} />
        <Route path="product/:id" element={<ProductPage />} />
        <Route path="orders/:id" element={<OrderPage />} />
        <Route path="explore" element={<ExplorePage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="categories" element={<CategoryPage />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="sign-in" element={<SignInPage />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="enter-reset-code" element={<EnterCodePage />} />
        {authentication.isAuthenticated ? (
          <Route path="profile/*" element={<ProfilePage />} />
        ) : null}
        {/* <Route
          path="*"
          element={
            <Navigate
              to={authentication.isAuthenticated ? "/home" : "/sign-in"}
              replace
            />
          }
        /> */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </div>
  );
};

export default App;
