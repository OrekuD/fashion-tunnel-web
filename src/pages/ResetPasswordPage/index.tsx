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
import forgotPasswordAsyncActions from "../../store/actions/forgotPassword.action";
import ResetPasswordRequest from "../../network/requests/ResetPasswordRequest";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = React.useState("");
  const [codeError, setCodeError] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { forgotPassword } = useSelectState();

  const dispatch = useDispatch();
  const { request } = useSelectState();
  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (!forgotPassword.email && !forgotPassword.code) {
      navigate("/home");
    }
  }, [forgotPassword.email, forgotPassword.code]);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(forgotPasswordAsyncActions.resetPassword.typePrefix)) {
      RM.consume(forgotPasswordAsyncActions.resetPassword.typePrefix);
      setIsLoading(false);
      navigate("/home");
      return;
    }

    if (RM.isRejected(forgotPasswordAsyncActions.resetPassword.typePrefix)) {
      RM.consume(forgotPasswordAsyncActions.resetPassword.typePrefix);
      setIsLoading(false);
      setCodeError("Your code is invalid");
      return;
    }
  }, [updatedAt, request.updatedAt]);

  const canProceed = React.useMemo(() => {
    return !isAnyEmpty([confirmPassword, password]);
  }, [confirmPassword, password]);

  const handleSubmit = () => {
    if (!canProceed || isLoading) {
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }
    setIsLoading(true);

    const payload: ResetPasswordRequest = {
      code: forgotPassword.code,
      email: forgotPassword.email,
      password: password,
    };
    dispatch(forgotPasswordAsyncActions.resetPassword(payload));
  };

  return (
    <>
      <Header />
      <div className={classes["container"]}>
        <p className={classes["title"]}>Reset your password</p>
        <TextInput
          value={password}
          onChange={(text) => {
            setPassword(text);
            setPasswordError("");
          }}
          label="Password"
          placeholder="Enter your password"
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
        <TextInput
          value={confirmPassword}
          onChange={(text) => {
            setConfirmPassword(text);
            setPasswordError("");
          }}
          label="Confirm Password"
          placeholder="Enter password confirmation"
          type={showConfirmPassword ? "text" : "password"}
          rightIcon={
            <button
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={{ marginTop: 2 }}
            >
              {!showConfirmPassword ? (
                <EyeCancelIcon width={24} height={24} color={colors.grey} />
              ) : (
                <EyeIcon width={24} height={24} color={colors.grey} />
              )}
            </button>
          }
        />
        {codeError.length > 0 && (
          <p className={classes["label"]}>{codeError}</p>
        )}
        <Button
          label="Submit"
          onClick={handleSubmit}
          isDisabled={isLoading || !canProceed}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default ResetPasswordPage;
