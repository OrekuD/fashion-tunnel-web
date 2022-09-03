import React from "react";
import { useDispatch } from "react-redux";
import colors from "../../constants/colors";
import userAsyncActions from "../../store/actions/user.action";
import userAddressAsyncActions from "../../store/actions/userAddress.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import { userAddressActions } from "../../store/slices/userAddress.slice";
import Button from "../Button";
import { EditIcon, TrashIcon } from "../Icons";
import RadioButton from "../RadioButton";
import classes from "./index.module.scss";

interface Props {
  setShowAddNewAddressView: React.Dispatch<React.SetStateAction<boolean>>;
  setShowEditAddressView: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedAddressId: React.Dispatch<React.SetStateAction<string>>;
}

const AddressBookView = (props: Props) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const dispatch = useDispatch();
  const { user, userAddress, request } = useSelectState();

  React.useEffect(() => {
    dispatch(userAddressAsyncActions.index());
  }, []);

  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(userAddressAsyncActions.index.typePrefix)) {
      RM.consume(userAddressAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isRejected(userAddressAsyncActions.index.typePrefix)) {
      RM.consume(userAddressAsyncActions.index.typePrefix);
      setIsLoading(false);

      return;
    }
  }, [updatedAt, request.updatedAt]);

  return (
    <>
      <p className={classes["section-title"]}>Address book</p>
      {userAddress.list.length === 0 ? (
        <>
          <p className={classes["label"]}>
            You currently have no saved
            <br />
            addresses.
          </p>
          <Button
            label="Add one"
            onClick={() => {
              console.log("pressed");
              props.setShowAddNewAddressView(true);
            }}
          />
        </>
      ) : (
        <>
          {userAddress.list.map(
            ({ name, addressLine, postalCode, id }, index) => {
              const isActive = userAddress.activeAddressId === id;
              return (
                <div
                  className={classes["address"]}
                  style={{ borderTopWidth: index === 0 ? 0 : 1 }}
                  key={id}
                >
                  <div className={classes["content"]}>
                    <p className={classes["name"]}>{name}</p>
                    <p>{addressLine}</p>
                    <p>{postalCode}</p>
                    <div className={classes["row"]}>
                      <button
                        onClick={() => {
                          props.setSelectedAddressId(id);
                          props.setShowEditAddressView(true);
                        }}
                      >
                        <EditIcon
                          width={24}
                          height={24}
                          color={colors.primary}
                        />
                      </button>
                      <button
                        disabled={isDeleting}
                        onClick={() => {
                          setIsDeleting(true);
                          dispatch(userAddressAsyncActions.deleteAddress(id));
                        }}
                      >
                        <TrashIcon
                          width={24}
                          height={24}
                          color={colors.error}
                        />
                      </button>
                    </div>
                  </div>
                  <RadioButton
                    isChecked={isActive}
                    onClick={() => {
                      dispatch(
                        userAddressActions.setActiveAddress({
                          userAddressId: id,
                        })
                      );
                      dispatch(
                        userAsyncActions.updateDetails({
                          activeAddressId: id,
                          email: user.email,
                          lastname: user.lastname,
                          firstname: user.firstname,
                        })
                      );
                    }}
                  />
                </div>
              );
            }
          )}
          <Button
            label="Add new address"
            onClick={() => props.setShowAddNewAddressView(true)}
            style={{ marginTop: 12 }}
          />
        </>
      )}
    </>
  );
};

export default AddressBookView;
