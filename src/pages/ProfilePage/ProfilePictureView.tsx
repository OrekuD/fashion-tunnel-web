import React from "react";
import { useDispatch } from "react-redux";
import colors from "../../constants/colors";
import UpdateAddressRequest from "../../network/requests/UpdateAddressRequest";
import userAddressAsyncActions from "../../store/actions/userAddress.action";
import RequestManager from "../../store/request-manager";
import { useSelectState } from "../../store/selectors";
import isAnyEmpty from "../../utils/isAnyEmpty";
import Button from "../../components/Button";
import { ChevronRightIcon, PlusIcon, UploadIcon } from "../../components/Icons";
import TextInput from "../../components/TextInput";
import classes from "./index.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import UpdateUserProfileImageRequest from "../../network/requests/UpdateUserProfileImageRequest";
import uploadAsyncActions from "../../store/actions/upload.action";
import userAsyncActions from "../../store/actions/user.action";

const ProfilePictureView = () => {
  const { request, userAddress, user, upload } = useSelectState();
  const navigate = useNavigate();
  const { addressId } = useParams<{ addressId: string }>();
  const address = React.useMemo(
    () => userAddress.list.find(({ id }) => id === addressId),
    [userAddress.list]
  );
  const [productImage, setProductImage] = React.useState<File>();
  const [postalCode, setPostalCode] = React.useState(address?.postalCode || "");

  const [isLoading, setIsLoading] = React.useState(false);

  const dispatch = useDispatch();
  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(uploadAsyncActions.index.typePrefix)) {
      RM.consume(uploadAsyncActions.index.typePrefix);
      dispatch(
        userAsyncActions.updateProfilePicture({ profilePicture: upload.image })
      );
      return;
    }

    if (RM.isRejected(uploadAsyncActions.index.typePrefix)) {
      RM.consume(uploadAsyncActions.index.typePrefix);
      setIsLoading(false);
      return;
    }

    if (RM.isFulfilled(userAsyncActions.updateProfilePicture.typePrefix)) {
      RM.consume(userAsyncActions.updateProfilePicture.typePrefix);
      setIsLoading(false);
      setProductImage(undefined);
      return;
    }

    if (RM.isRejected(userAsyncActions.updateProfilePicture.typePrefix)) {
      RM.consume(userAsyncActions.updateProfilePicture.typePrefix);
      setIsLoading(false);
      return;
    }
  }, [updatedAt, request.updatedAt]);

  const canProceed = React.useMemo(() => {
    return Boolean(productImage);
  }, [productImage]);

  const updateProfilePicture = () => {
    if (!canProceed || isLoading) {
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    formData.append("images", productImage!);

    dispatch(uploadAsyncActions.index(formData));
  };

  return (
    <>
      <button className={classes["back-button"]} onClick={() => navigate(-1)}>
        <ChevronRightIcon width={24} height={24} color={colors.deepgrey} />
        <p>Go back</p>
      </button>
      <p className={classes["section-title"]}>Profile image</p>
      <div className={classes["profile-image-container"]}>
        <img
          src={
            productImage
              ? URL.createObjectURL(productImage)
              : user.profilePicture
          }
          alt={user.email}
          className={classes["profile-image"]}
        />
        <label htmlFor="product-image">
          <div className={classes["upload-button"]}>
            <UploadIcon width={16} height={16} color={colors.white} />
          </div>
        </label>
      </div>
      <input
        type="file"
        id="product-image"
        accept="image/png, image/gif, image/jpeg, image/webp"
        className={classes["upload-file"]}
        onChange={(e) => {
          if (e.target?.files && e.target.files.length > 0) {
            setProductImage(e.target.files[0]);
          }
        }}
      />
      <Button
        label="Update"
        isDisabled={!canProceed || isLoading}
        isLoading={isLoading}
        onClick={updateProfilePicture}
        style={{ marginTop: "auto" }}
      />
    </>
  );
};

export default ProfilePictureView;
