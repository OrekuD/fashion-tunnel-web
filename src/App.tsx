import { Routes, Route, Navigate } from "react-router-dom";
import { useSelectState } from "./store/selectors";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import ProfilePage from "./pages/ProfilePage";

const App = () => {
  const { authentication } = useSelectState();

  return (
    <div className={"app-main-container"}>
      <Routes>
        {authentication.isAuthenticated ? (
          <>
            <Route path="profile" element={<ProfilePage />} />
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
              to={authentication.isAuthenticated ? "/profile" : "/sign-in"}
              replace
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
