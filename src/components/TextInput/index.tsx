import React from "react";
import classes from "./index.module.scss";

interface Props {
  placeholder: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  type?: React.HTMLInputTypeAttribute;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  rounded?: boolean;
  label?: string;
}

const TextInput = (props: Props) => {
  if (props.rounded) {
    return (
      <div className={classes["container-wrapper"]}>
        <div className={classes["rounded-text-input-container"]}>
          {props.leftIcon}
          <input
            className={classes["text-input"]}
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            type={props.type}
          />
          {props.rightIcon}
        </div>
        {props.error && <p className={classes["error"]}>{props.error}</p>}
      </div>
    );
  }

  return (
    <div className={classes["container-wrapper"]}>
      <p className={classes["label"]}>{props.label}</p>
      <div className={classes["text-input-container"]}>
        <input
          className={classes["text-input"]}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          type={props.type}
        />
        {props.rightIcon}
      </div>
      {props.error && <p className={classes["error"]}>{props.error}</p>}
    </div>
  );
};

export default TextInput;
