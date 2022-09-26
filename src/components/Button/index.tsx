import React from "react";
import colors from "../../constants/colors";
import Loader from "../Loader";
import classes from "./index.module.scss";

interface Props {
  label: string;
  onClick: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  style?: React.CSSProperties;
  className?: string;
  labelClassName?: string;
}

const Button = (props: Props) => {
  return (
    <button
      className={`${classes["button"]} ${props.className}`}
      onClick={props.onClick}
      disabled={props.isDisabled}
      style={props.style}
    >
      {props.isLoading ? (
        <Loader color={colors.white} />
      ) : (
        <p className={`${classes["label"]} ${props.labelClassName}`}>
          {props.label}
        </p>
      )}
    </button>
  );
};

export default Button;
