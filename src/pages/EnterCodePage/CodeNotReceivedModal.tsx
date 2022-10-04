import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import { ease } from "../../constants";
import forgotPasswordAsyncActions from "../../store/actions/forgotPassword.action";
import { useSelectState } from "../../store/selectors";
import { forgotPasswordActions } from "../../store/slices/forgotPassword.slice";
import classes from "./index.module.scss";

interface Props {
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
}

const CodeNotReceivedModal = (props: Props) => {
  const { forgotPassword } = useSelectState();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <AnimatePresence initial={false}>
      {props.isVisible ? (
        <>
          <motion.div
            className={classes["modal-backdrop"]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => props.setIsVisible(false)}
          />
          <motion.div
            className={classes["modal-content"]}
            initial={{ translateY: "100%" }}
            animate={{
              translateY: 0,
              transition: {
                ease: ease,
              },
            }}
            exit={{ translateY: "100%" }}
            drag="y"
            dragConstraints={{ left: 0, right: 0, top: 0 }}
            dragSnapToOrigin
            dragElastic={{ left: 0, right: 0, top: 0, bottom: 0.2 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80) {
                props.setIsVisible(false);
              }
            }}
          >
            <p className={classes["title"]}>Reset code</p>
            <p className={classes["label"]}>
              Having problems receiving the 6 digit OTP code? The email
              registered is <span>{` ${forgotPassword.email} `}.</span>
            </p>
            <p className={classes["label"]}>Is that correct?</p>
            <div className={classes["row"]}>
              <Button
                label="No, change email"
                onClick={() => {
                  props.setIsVisible(false);
                  dispatch(forgotPasswordActions.addCode({ code: "" }));
                  navigate(-1);
                }}
                style={{ width: "48%" }}
                className={classes["transparent-button"]}
                labelClassName={`${classes["button-label"]} ${classes["transparent-button-label"]}`}
              />
              <Button
                label="Yes, resend code"
                onClick={() => {
                  props.setIsLoading(true);
                  dispatch(
                    forgotPasswordAsyncActions.forgotPassword({
                      email: forgotPassword.email,
                    })
                  );
                }}
                isDisabled={props.isLoading}
                isLoading={props.isLoading}
                style={{ width: "48%" }}
                labelClassName={classes["button-label"]}
              />
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default CodeNotReceivedModal;
