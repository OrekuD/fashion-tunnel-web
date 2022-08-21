import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextInput } from "../../components";
import {
  EyeCancelIcon,
  EyeIcon,
  MailIcon,
  UserIcon,
} from "../../components/Icons";
import colors from "../../constants/colors";
import isAnyEmpty from "../../utils/isAnyEmpty";
import classes from "./index.module.scss";
import API from "../../constants/api";
import AuthenticationResponse from "../../network/responses/AuthenticationResponse";
import { AxiosResponse } from "axios";
import { authenticationActions } from "../../store/slices/authentication.slice";
import { userActions } from "../../store/slices/user.slice";
import SignUpRequest from "../../network/requests/SignUpRequest";
import { DeviceTypes } from "../../types";
import { useSelectState } from "../../store/selectors";
import RequestManager from "../../store/request-manager";
import authentictionAsyncActions from "../../store/actions/authentication.action";

const SignUpPage = () => {
  const [email, setEmail] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { request } = useSelectState();

  const dispatch = useDispatch();

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(authentictionAsyncActions.signup.typePrefix)) {
      RM.consume(authentictionAsyncActions.signup.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(authentictionAsyncActions.signup.typePrefix)) {
      RM.consume(authentictionAsyncActions.signup.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  const canProceed = React.useMemo(() => {
    if (emailError.trim().length > 0) {
      return false;
    }
    return !isAnyEmpty([email, password, firstName, lastName]);
  }, [email, password, firstName, lastName, emailError]);

  const handleSubmit = async () => {
    if (!canProceed || isLoading) {
      return;
    }
    setIsLoading(true);

    const payload: SignUpRequest = {
      email: email.trim().toLowerCase(),
      password: password.trim(),
      firstname: firstName.trim(),
      lastname: lastName.trim(),
      deviceType: DeviceTypes.WEB,
    };

    dispatch(authentictionAsyncActions.signup(payload));
  };

  return (
    <div className={classes["container"]}>
      <p className={classes["title"]}>Create a new account</p>
      <TextInput
        value={firstName}
        onChange={setFirstName}
        placeholder="First name"
        rightIcon={<UserIcon width={24} height={24} color={colors.grey} />}
      />
      <TextInput
        value={lastName}
        onChange={setLastName}
        placeholder="Last name"
        rightIcon={<UserIcon width={24} height={24} color={colors.grey} />}
      />
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
        onChange={setPassword}
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
        Already have an account? <Link to="/sign-in">Sign in</Link>
      </p>
      <Button
        label="Create account"
        onClick={handleSubmit}
        isDisabled={isLoading || !canProceed}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SignUpPage;
