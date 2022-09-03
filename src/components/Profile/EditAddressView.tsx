import React from "react";
import { useDispatch } from "react-redux";
import colors from "../../constants/colors";
import UpdateAddressRequest from "../../network/requests/UpdateAddressRequest";
import userAddressAsyncActions from "../../store/actions/userAddress.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import isAnyEmpty from "../../utils/isAnyEmpty";
import Button from "../Button";
import { ChevronRightIcon } from "../Icons";
import TextInput from "../TextInput";
import classes from "./index.module.scss";

interface Props {
  goBack: () => void;
  selectedAddressId: string;
}

const EditAddressView = (props: Props) => {
  const { request, userAddress } = useSelectState();
  const address = React.useMemo(
    () => userAddress.list.find(({ id }) => id === props.selectedAddressId),
    [userAddress.list]
  );
  const [name, setName] = React.useState(address?.name || "");
  const [addressLine, setAddressLine] = React.useState(
    address?.addressLine || ""
  );
  const [postalCode, setPostalCode] = React.useState(address?.postalCode || "");

  const [isLoading, setIsLoading] = React.useState(false);

  const dispatch = useDispatch();
  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(userAddressAsyncActions.updateAddress.typePrefix)) {
      RM.consume(userAddressAsyncActions.updateAddress.typePrefix);
      setIsLoading(false);
      props.goBack();
      return;
    }

    if (RM.isRejected(userAddressAsyncActions.updateAddress.typePrefix)) {
      RM.consume(userAddressAsyncActions.updateAddress.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  const canProceed = React.useMemo(() => {
    return !isAnyEmpty([name, addressLine, postalCode]);
  }, [name, addressLine, postalCode]);

  const updateAddress = () => {
    if (!canProceed || isLoading) {
      return;
    }
    setIsLoading(true);

    const payload: UpdateAddressRequest = {
      addressLine: addressLine.trim(),
      name: name.trim(),
      postalCode: postalCode.trim(),
      id: address?.id || "",
    };

    dispatch(userAddressAsyncActions.updateAddress(payload));
  };

  return (
    <>
      <button className={classes["back-button"]} onClick={props.goBack}>
        <ChevronRightIcon width={24} height={24} color={colors.deepgrey} />
        <p>Go back</p>
      </button>
      <p className={classes["section-title"]}>Edit address</p>
      <TextInput
        onChange={setName}
        value={name}
        placeholder="Enter the address name"
        label="Address name"
      />
      <TextInput
        onChange={setAddressLine}
        value={addressLine}
        placeholder="Enter the address line"
        label="Address line"
      />
      <TextInput
        onChange={setPostalCode}
        value={postalCode}
        placeholder="Enter the postal code"
        label="Postal code"
      />
      <Button
        label="Update"
        isDisabled={!canProceed || isLoading}
        isLoading={isLoading}
        onClick={updateAddress}
        style={{ width: 350, marginTop: "auto" }}
      />
    </>
  );
};

export default EditAddressView;
