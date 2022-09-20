import React from "react";
import classes from "./index.module.scss";

interface Props {
  placeholder: string;
  value: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  type?: React.HTMLInputTypeAttribute;
  name?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  rounded?: boolean;
  label?: string;
  onSubmit?: () => void;
  style?: React.CSSProperties;
}

const TextInput = (props: Props) => {
  if (props.rounded) {
    return (
      <div className={classes["container-wrapper"]} style={props.style}>
        <div className={classes["rounded-text-input-container"]}>
          {props.leftIcon}
          <input
            className={classes["text-input"]}
            placeholder={props.placeholder}
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
            type={props.type}
            name={props.name}
            onSubmit={props.onSubmit}
          />
          {props.rightIcon}
        </div>
        {props.error && <p className={classes["error"]}>{props.error}</p>}
      </div>
    );
  }

  return (
    <div className={classes["container-wrapper"]} style={props.style}>
      <p className={classes["label"]}>{props.label}</p>
      <div className={classes["text-input-container"]}>
        <input
          className={classes["text-input"]}
          placeholder={props.placeholder}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          type={props.type}
          name={props.name}
          onSubmit={props.onSubmit}
        />
        {props.rightIcon}
      </div>
      {props.error && <p className={classes["error"]}>{props.error}</p>}
    </div>
  );
};

export default TextInput;
