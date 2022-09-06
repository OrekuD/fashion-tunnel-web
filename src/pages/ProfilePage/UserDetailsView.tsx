import React from "react";
import { useDispatch } from "react-redux";
import colors from "../../constants/colors";
import UpdateUserRequest from "../../network/requests/UpdateUserRequest";
import userAsyncActions from "../../store/actions/user.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import isAnyEmpty from "../../utils/isAnyEmpty";
import Button from "../../components/Button";
import { ChevronRightIcon, MailIcon, UserIcon } from "../../components/Icons";
import TextInput from "../../components/TextInput";
import classes from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import { useWindowResize } from "../../hooks/useWindowResize";

const UserDetailsView = () => {
  const { user, request, userAddress } = useSelectState();
  const [emailError, setEmailError] = React.useState("");
  const [firstName, setFirstName] = React.useState(user?.firstname || "");
  const [lastName, setLastName] = React.useState(user?.lastname || "");
  const [email, setEmail] = React.useState(user?.email || "");
  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isSmallerDevice } = useWindowResize();

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(userAsyncActions.updateDetails.typePrefix)) {
      RM.consume(userAsyncActions.updateDetails.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(userAsyncActions.updateDetails.typePrefix)) {
      RM.consume(userAsyncActions.updateDetails.typePrefix);
      setIsLoading(false);
      const error = RM.getRequest(userAsyncActions.updateDetails.typePrefix);
      if (error?.payload.status === 409) {
        setEmailError("E-mail is taken");
      } else {
      }
      return;
    }
  }, [updatedAt, request.updatedAt]);

  const canProceed = React.useMemo(() => {
    return !isAnyEmpty([lastName, firstName, email]);
  }, [lastName, firstName, email]);

  const updateDetails = () => {
    if (!canProceed || isLoading) {
      return;
    }
    setIsLoading(true);

    const payload: UpdateUserRequest = {
      email: email.trim().toLowerCase(),
      firstname: firstName.trim(),
      lastname: lastName.trim(),
      activeAddressId: userAddress.activeAddressId,
    };
    dispatch(userAsyncActions.updateDetails(payload));
  };

  return (
    <>
      {/* {isSmallerDevice && (
        <button className={classes["back-button"]} onClick={() => navigate(-1)}>
          <ChevronRightIcon width={24} height={24} color={colors.deepgrey} />
          <p>Go back</p>
        </button>
      )} */}
      <p className={classes["section-title"]}>Your details</p>
      <TextInput
        onChange={setFirstName}
        value={firstName}
        placeholder="Enter your first name"
        label="First name"
        rightIcon={<UserIcon width={24} height={24} color={colors.grey} />}
      />
      <TextInput
        onChange={setLastName}
        value={lastName}
        placeholder="Enter your last name"
        label="Last name"
        rightIcon={<UserIcon width={24} height={24} color={colors.grey} />}
      />
      <TextInput
        onChange={setEmail}
        value={email}
        placeholder="Enter your e-mail"
        label="E-mail"
        rightIcon={<MailIcon width={24} height={24} color={colors.grey} />}
        error={emailError}
      />
      <p className={classes["section-title"]}>Account Security</p>
      <button
        className={classes["button"]}
        onClick={() => navigate("/profile/account/security")}
      >
        <p>Change password</p>
        <ChevronRightIcon width={24} height={24} color={colors.deepgrey} />
      </button>
      <Button
        label="Update"
        isDisabled={!canProceed || isLoading}
        isLoading={isLoading}
        onClick={updateDetails}
        style={{ marginTop: "auto" }}
      />
    </>
  );
};

export default UserDetailsView;
