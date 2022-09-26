import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, TextInput } from "../../components";
import { MailIcon } from "../../components/Icons";
import colors from "../../constants/colors";
import isAnyEmpty from "../../utils/isAnyEmpty";
import classes from "./index.module.scss";
import { useSelectState } from "../../store/selectors";
import RequestManager from "../../store/request-manager";
import Header from "../../components/Header";
import forgotPasswordAsyncActions from "../../store/actions/forgotPassword.action";
import { forgotPasswordActions } from "../../store/slices/forgotPassword.slice";
import ForgotPasswordRequest from "../../network/requests/ForgotPasswordRequest";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const dispatch = useDispatch();
  const { request, forgotPassword } = useSelectState();
  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (forgotPassword.email) {
      setEmail(forgotPassword.email);
    }
  }, []);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(forgotPasswordAsyncActions.forgotPassword.typePrefix)) {
      RM.consume(forgotPasswordAsyncActions.forgotPassword.typePrefix);
      setIsLoading(false);
      dispatch(forgotPasswordActions.addEmail({ email }));
      navigate("/enter-reset-code");
      return;
    }

    if (RM.isRejected(forgotPasswordAsyncActions.forgotPassword.typePrefix)) {
      RM.consume(forgotPasswordAsyncActions.forgotPassword.typePrefix);
      setIsLoading(false);
      setEmailError("Your e-mail doesn't exist");
      return;
    }
  }, [updatedAt, request.updatedAt]);

  const canProceed = React.useMemo(() => {
    if (emailError.trim().length > 0) {
      return false;
    }
    return !isAnyEmpty([email]);
  }, [email, emailError]);

  const handleSubmit = () => {
    if (!canProceed || isLoading) {
      return;
    }
    setIsLoading(true);

    const payload: ForgotPasswordRequest = {
      email: email.trim().toLowerCase(),
    };
    dispatch(forgotPasswordAsyncActions.forgotPassword(payload));
  };

  return (
    <>
      <Header />
      <div className={classes["container"]}>
        <p className={classes["title"]}>Recover password</p>
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
        <Button
          label="Continue"
          onClick={handleSubmit}
          isDisabled={isLoading || !canProceed}
          isLoading={isLoading}
          style={{
            marginTop: 12,
          }}
        />
      </div>
    </>
  );
};

export default ForgotPasswordPage;
