import React, { LegacyRef, MutableRefObject, useRef } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, TextInput } from "../../components";
import { EyeCancelIcon, EyeIcon, MailIcon } from "../../components/Icons";
import colors from "../../constants/colors";
import SignInRequest from "../../network/requests/SignInRequest";
import isAnyEmpty from "../../utils/isAnyEmpty";
import classes from "./index.module.scss";
import { DeviceTypes } from "../../types";
import authenticationAsyncActions from "../../store/actions/authentication.action";
import { useSelectState } from "../../store/selectors";
import RequestManager from "../../store/request-manager";
import Header from "../../components/Header";
import { forgotPasswordActions } from "../../store/slices/forgotPassword.slice";
import sanitizeDigit from "../../utils/sanitizeDigit";
import useFocus from "../../hooks/useFocus";
import { AnimatePresence, motion } from "framer-motion";
import { ease } from "../../constants";
import forgotPasswordAsyncActions from "../../store/actions/forgotPassword.action";

const EnterCodePage = () => {
  const navigate = useNavigate();
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const [firstDigit, setFirstDigit] = React.useState("");
  const [secondDigit, setSecondDigit] = React.useState("");
  const [thirdDigit, setThirdDigit] = React.useState("");
  const [fourthDigit, setFourthDigit] = React.useState("");
  const [fifthDigit, setFifthDigit] = React.useState("");
  const [sixthDigit, setSixthDigit] = React.useState("");

  const [firstDigitRef, setFirstDigitFocus] = useFocus();
  const [secondDigitRef, setSecondDigitFocus] = useFocus();
  const [thirdDigitRef, setThirdDigitFocus] = useFocus();
  const [fourthDigitRef, setFourthDigitFocus] = useFocus();
  const [fifthDigitRef, setFifthDigitFocus] = useFocus();
  const [sixthDigitRef, setSixthDigitFocus] = useFocus();

  const [showBottomSheet, setShowBottomSheet] = React.useState(false);
  const { forgotPassword, request } = useSelectState();

  const dispatch = useDispatch();
  const [updatedAt] = React.useState(request.updatedAt);

  React.useEffect(() => {
    if (forgotPassword.code && forgotPassword.code.length === 6) {
      setFirstDigit(forgotPassword.code[0]);
      setSecondDigit(forgotPassword.code[1]);
      setThirdDigit(forgotPassword.code[2]);
      setFourthDigit(forgotPassword.code[3]);
      setFifthDigit(forgotPassword.code[4]);
      setSixthDigit(forgotPassword.code[5]);
    }
  }, []);

  React.useEffect(() => {
    if (updatedAt === request.updatedAt) {
      return;
    }
    const RM = new RequestManager(request, dispatch);

    if (RM.isFulfilled(forgotPasswordAsyncActions.forgotPassword.typePrefix)) {
      RM.consume(forgotPasswordAsyncActions.forgotPassword.typePrefix);
      setIsLoading(false);
      setShowBottomSheet(false);
      return;
    }

    if (RM.isRejected(forgotPasswordAsyncActions.forgotPassword.typePrefix)) {
      RM.consume(forgotPasswordAsyncActions.forgotPassword.typePrefix);
      setIsLoading(false);
      // Alert.alert('Reset code', 'There was an issue sending your reset code');
      return;
    }
  }, [updatedAt, request.updatedAt]);

  React.useEffect(() => {
    if (!forgotPassword.email) {
      navigate("/home");
    }
  }, [forgotPassword.email]);

  const canProceed = React.useMemo(() => {
    return code.length === 6;
  }, [code]);

  const handleSubmit = () => {
    if (!canProceed) {
      return;
    }
    dispatch(forgotPasswordActions.addCode({ code }));
    navigate("/reset-password");
  };

  React.useEffect(() => {
    try {
      const _code = [
        firstDigit,
        secondDigit,
        thirdDigit,
        fourthDigit,
        fifthDigit,
        sixthDigit,
      ].join("");
      const isNumber = Number(_code);
      if (typeof isNumber === "number") {
        setCode(_code);
        dispatch(forgotPasswordActions.addCode({ code: _code }));
      }
    } catch (error) {}
  }, [
    firstDigit,
    secondDigit,
    thirdDigit,
    fourthDigit,
    fifthDigit,
    sixthDigit,
  ]);

  return (
    <>
      <AnimatePresence initial={false}>
        {showBottomSheet ? (
          <>
            <motion.div
              className={classes["modal-backdrop"]}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBottomSheet(false)}
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
                  setShowBottomSheet(false);
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
                    setShowBottomSheet(false);
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
                    setIsLoading(true);
                    dispatch(
                      forgotPasswordAsyncActions.forgotPassword({
                        email: forgotPassword.email,
                      })
                    );
                  }}
                  isDisabled={isLoading}
                  isLoading={isLoading}
                  style={{ width: "48%" }}
                  labelClassName={classes["button-label"]}
                />
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
      <Header />
      <div className={classes["container"]}>
        <p className={classes["title"]}>Enter 6 digit code</p>
        <div className={classes["text-inputs"]}>
          <div className={classes["text-input"]}>
            <input
              type="text"
              maxLength={1}
              placeholder="*"
              value={firstDigit}
              ref={firstDigitRef}
              onChange={(e) => {
                const value = sanitizeDigit(e.target.value);
                setFirstDigit(value);
                if (value.length > 0) {
                  setSecondDigitFocus?.();
                }
              }}
            />
          </div>
          <div className={classes["text-input"]}>
            <input
              type="text"
              maxLength={1}
              placeholder="*"
              value={secondDigit}
              ref={secondDigitRef}
              onChange={(e) => {
                const value = sanitizeDigit(e.target.value);
                setSecondDigit(value);
                if (value.length > 0) {
                  setThirdDigitFocus?.();
                }
              }}
            />
          </div>
          <div className={classes["text-input"]}>
            <input
              type="text"
              maxLength={1}
              placeholder="*"
              value={thirdDigit}
              ref={thirdDigitRef}
              onChange={(e) => {
                const value = sanitizeDigit(e.target.value);
                setThirdDigit(value);
                if (value.length > 0) {
                  setFourthDigitFocus?.();
                }
              }}
            />
          </div>
          <div className={classes["text-input"]}>
            <input
              type="text"
              maxLength={1}
              placeholder="*"
              value={fourthDigit}
              ref={fourthDigitRef}
              onChange={(e) => {
                const value = sanitizeDigit(e.target.value);
                setFourthDigit(value);
                if (value.length > 0) {
                  setFifthDigitFocus?.();
                }
              }}
            />
          </div>
          <div className={classes["text-input"]}>
            <input
              type="text"
              maxLength={1}
              placeholder="*"
              value={fifthDigit}
              ref={fifthDigitRef}
              onChange={(e) => {
                const value = sanitizeDigit(e.target.value);
                setFifthDigit(value);
                if (value.length > 0) {
                  setSixthDigitFocus?.();
                }
              }}
            />
          </div>
          <div className={classes["text-input"]}>
            <input
              type="text"
              maxLength={1}
              placeholder="*"
              value={sixthDigit}
              ref={sixthDigitRef}
              onChange={(e) => {
                const value = sanitizeDigit(e.target.value);
                setSixthDigit(value);
              }}
            />
          </div>
        </div>
        <button
          className={classes["button"]}
          onClick={() => setShowBottomSheet(true)}
        >
          <p>Code not received?</p>
        </button>
        <Button
          label="continue"
          onClick={handleSubmit}
          isDisabled={!canProceed}
        />
      </div>
    </>
  );
};

export default EnterCodePage;
