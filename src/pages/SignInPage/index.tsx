import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextInput } from "../../components";
import { EyeCancelIcon, EyeIcon, MailIcon } from "../../components/Icons";
import colors from "../../constants/colors";
import SignInRequest from "../../network/requests/SignInRequest";
import isAnyEmpty from "../../utils/isAnyEmpty";
import classes from "./index.module.scss";
import { DeviceTypes } from "../../types";
import authenticationAsyncActions from "../../store/actions/authentication.action";
import { useSelectState } from "../../store/selectors";
import RequestManager from "../../store/request-manager";
import Header from "../../components/Header";

const SignInPage = () => {
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { request } = useSelectState();
  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(authenticationAsyncActions.signin.typePrefix)) {
      RM.consume(authenticationAsyncActions.signin.typePrefix);
      setIsLoading(false);
      navigate(-1);
      return;
    }

    if (RM.isRejected(authenticationAsyncActions.signin.typePrefix)) {
      RM.consume(authenticationAsyncActions.signin.typePrefix);
      setIsLoading(false);
      setEmailError("Your credentials are invalid");
      return;
    }
  }, [updatedAt, request.updatedAt]);

  const canProceed = React.useMemo(() => {
    if (emailError.trim().length > 0) {
      return false;
    }
    return !isAnyEmpty([email, password]);
  }, [email, password, emailError]);

  const handleSubmit = async () => {
    if (!canProceed || isLoading) {
      return;
    }
    setIsLoading(true);

    const payload: SignInRequest = {
      email: email.trim().toLowerCase(),
      password: password.trim(),
      deviceType: DeviceTypes.WEB,
    };
    dispatch(authenticationAsyncActions.signin(payload));
  };

  return (
    <>
      <Header />
      <div className={classes["container"]}>
        <p className={classes["title"]}>Welcome back</p>
        <TextInput
          value={email}
          onChange={(text) => {
            setEmail(text);
            setEmailError("");
          }}
          error={emailError}
          placeholder="Email"
          rightIcon={<MailIcon width={24} height={24} color={colors.grey} />}
        />
        <TextInput
          value={password}
          onChange={(text) => {
            setPassword(text);
            setEmailError("");
          }}
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          rightIcon={
            <button
              onClick={() => setShowPassword(!showPassword)}
              style={{ marginTop: 2 }}
            >
              {!showPassword ? (
                <EyeCancelIcon width={24} height={24} color={colors.grey} />
              ) : (
                <EyeIcon width={24} height={24} color={colors.grey} />
              )}
            </button>
          }
        />
        <p className={classes["label"]}>
          Don't have an account? <Link to="/sign-up">Create one</Link>
        </p>
        <Button
          label="sign in"
          onClick={handleSubmit}
          isDisabled={isLoading || !canProceed}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default SignInPage;
