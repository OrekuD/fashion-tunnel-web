import React from "react";
import classes from "./index.module.scss";

interface Props {
  isChecked: boolean;
  onClick: () => void;
}

const RadioButton = (props: Props) => {
  return (
    <button className={classes["container"]} onClick={props.onClick}>
      {props.isChecked && <div />}
    </button>
  );
};

export default RadioButton;
