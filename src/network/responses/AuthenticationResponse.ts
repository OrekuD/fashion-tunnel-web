import User from "../../models/User";
import DeviceTypes from "../../types";

export default interface AuthenticationResponse {
  accessToken: string;
  deviceType: DeviceTypes;
  user: User;
}
