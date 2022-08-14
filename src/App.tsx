import { Routes, Route, Navigate } from "react-router-dom";
import { useSelectState } from "./store/selectors";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";

const App = () => {
  const { authentication } = useSelectState();

  return (
    <div className={"app-main-container"}>
      <Routes>
        {authentication.isAuthenticated ? (
          <>
            <Route path="home" element={<HomePage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="product/:id" element={<ProductPage />} />
          </>
        ) : (
          <>
            <Route path="sign-in" element={<SignInPage />} />
            <Route path="sign-up" element={<SignUpPage />} />
          </>
        )}
        <Route
          path="*"
          element={
            <Navigate
              to={authentication.isAuthenticated ? "/home" : "/sign-in"}
              replace
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
