import React from "react";
import { useDispatch } from "react-redux";
import colors from "../../constants/colors";
import userAsyncActions from "../../store/actions/user.action";
import userAddressAsyncActions from "../../store/actions/userAddress.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import { userAddressActions } from "../../store/slices/userAddress.slice";
import Button from "../../components/Button";
import { ChevronRightIcon, EditIcon, TrashIcon } from "../../components/Icons";
import RadioButton from "../../components/RadioButton";
import classes from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import { useWindowResize } from "../../hooks/useWindowResize";

const AddressBookView = () => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const { isSmallerDevice } = useWindowResize();

  const dispatch = useDispatch();
  const navigate = useNavigate();
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
      {/* {isSmallerDevice && (
        <button className={classes["back-button"]} onClick={() => navigate(-1)}>
          <ChevronRightIcon width={24} height={24} color={colors.deepgrey} />
          <p>Go back</p>
        </button>
      )} */}
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
            onClick={() => navigate("/profile/address-book/create")}
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
                  style={{
                    marginBottom:
                      index === userAddress.list.length - 1 ? 24 : 0,
                  }}
                  key={id}
                >
                  <div className={classes["content"]}>
                    <p className={classes["name"]}>{name}</p>
                    <p>{addressLine}</p>
                    <p>{postalCode}</p>
                    <div className={classes["row"]}>
                      <button
                        onClick={() => {
                          navigate("/profile/address-book/edit/6");
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
            onClick={() => navigate("/profile/address-book/create")}
            style={{ marginTop: "auto" }}
          />
        </>
      )}
    </>
  );
};

export default AddressBookView;
