import React from "react";
import { useDispatch } from "react-redux";
import colors from "../../constants/colors";
import AddNewAddressRequest from "../../network/requests/AddNewAddressRequest";
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
}

const AddNewAddressView = (props: Props) => {
  const [name, setName] = React.useState("");
  const [addressLine, setAddressLine] = React.useState("");
  const [postalCode, setPostalCode] = React.useState("");

  const [isLoading, setIsLoading] = React.useState(false);
  const dispatch = useDispatch();
  const { request } = useSelectState();
  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(userAddressAsyncActions.addNewAddress.typePrefix)) {
      RM.consume(userAddressAsyncActions.addNewAddress.typePrefix);
      setIsLoading(false);
      props.goBack();
      return;
    }

    if (RM.isRejected(userAddressAsyncActions.addNewAddress.typePrefix)) {
      RM.consume(userAddressAsyncActions.addNewAddress.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  const canProceed = React.useMemo(() => {
    return !isAnyEmpty([name, addressLine, postalCode]);
  }, [name, addressLine, postalCode]);

  const addNewAddress = () => {
    if (!canProceed || isLoading) {
      return;
    }
    setIsLoading(true);

    const payload: AddNewAddressRequest = {
      addressLine: addressLine.trim(),
      name: name.trim(),
      postalCode: postalCode.trim(),
    };

    dispatch(userAddressAsyncActions.addNewAddress(payload));
  };

  return (
    <>
      <button className={classes["back-button"]} onClick={props.goBack}>
        <ChevronRightIcon width={24} height={24} color={colors.deepgrey} />
        <p>Go back</p>
      </button>
      <p className={classes["section-title"]}>Add new address</p>
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
        label="Add"
        isDisabled={!canProceed || isLoading}
        isLoading={isLoading}
        onClick={addNewAddress}
        style={{ width: 350, marginTop: "auto" }}
      />
    </>
  );
};

export default AddNewAddressView;
