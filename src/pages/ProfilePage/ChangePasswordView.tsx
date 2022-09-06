import React from "react";
import { useDispatch } from "react-redux";
import colors from "../../constants/colors";
import ChangePasswordRequest from "../../network/requests/ChangePasswordRequest";
import userAsyncActions from "../../store/actions/user.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import isAnyEmpty from "../../utils/isAnyEmpty";
import Button from "../../components/Button";
import {
  ChevronRightIcon,
  EyeCancelIcon,
  EyeIcon,
} from "../../components/Icons";
import TextInput from "../../components/TextInput";
import classes from "./index.module.scss";
import { useNavigate } from "react-router-dom";

const ChangePasswordView = () => {
  const [passwordError, setPasswordError] = React.useState("");
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(true);
  const [showNewPassword, setShowNewPassword] = React.useState(true);
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

    if (RM.isFulfilled(userAsyncActions.changePassword.typePrefix)) {
      RM.consume(userAsyncActions.changePassword.typePrefix);
      setIsLoading(false);
      setCurrentPassword("");
      setNewPassword("");
      // Alert.alert('Password', 'Your password change was succcessful');
      return;
    }

    if (RM.isRejected(userAsyncActions.changePassword.typePrefix)) {
      RM.consume(userAsyncActions.changePassword.typePrefix);
      setIsLoading(false);
      setPasswordError("Your current password is incorrect");
      return;
    }
  }, [updatedAt, request.updatedAt]);

  const canProceed = React.useMemo(() => {
    return !isAnyEmpty([currentPassword, newPassword]);
  }, [currentPassword, newPassword]);

  const changePassword = () => {
    if (!canProceed || isLoading) {
      return;
    }
    setIsLoading(true);

    const payload: ChangePasswordRequest = {
      oldPassword: currentPassword,
      newPassword: newPassword,
    };
    dispatch(userAsyncActions.changePassword(payload));
  };

  return (
    <>
      <button className={classes["back-button"]} onClick={() => navigate(-1)}>
        <ChevronRightIcon width={24} height={24} color={colors.deepgrey} />
        <p>Go back</p>
      </button>
      <p className={classes["section-title"]}>Change password</p>
      <TextInput
        onChange={(text) => {
          setCurrentPassword(text);
          setPasswordError("");
        }}
        value={currentPassword}
        placeholder="Enter your current password"
        label="Current password"
        error={passwordError}
        type={!showCurrentPassword ? "text" : "password"}
        rightIcon={
          <button
            onClick={() => setShowCurrentPassword((prevValue) => !prevValue)}
          >
            {showCurrentPassword ? (
              <EyeCancelIcon width={24} height={24} color={colors.grey} />
            ) : (
              <EyeIcon width={24} height={24} color={colors.grey} />
            )}
          </button>
        }
      />
      <TextInput
        onChange={setNewPassword}
        value={newPassword}
        placeholder="Enter your new password"
        label="New password"
        type={!showNewPassword ? "text" : "password"}
        rightIcon={
          <button onClick={() => setShowNewPassword((prevValue) => !prevValue)}>
            {showNewPassword ? (
              <EyeCancelIcon width={24} height={24} color={colors.grey} />
            ) : (
              <EyeIcon width={24} height={24} color={colors.grey} />
            )}
          </button>
        }
      />
      <Button
        label="Update"
        isDisabled={!canProceed || isLoading}
        isLoading={isLoading}
        onClick={changePassword}
        style={{ marginTop: "auto" }}
      />
    </>
  );
};

export default ChangePasswordView;
