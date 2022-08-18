import colors from "../../constants/colors";
import { useSelectState } from "../../store/selectors";
import classes from "./index.module.scss";

const ProfilePage = () => {
  const { user } = useSelectState();
  return (
    <div className={classes["container"]}>
      <div className={classes["profile"]}>
        {/* <UserCircleIcon width={80} height={80} color={colors.darkgrey} /> */}
        <p
          className={classes["label"]}
        >{`${user.firstname} ${user.lastname}`}</p>
        <p className={classes["label"]}>{user.email}</p>
      </div>
    </div>
  );
};

export default ProfilePage;
