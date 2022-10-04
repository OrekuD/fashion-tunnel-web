import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components";
import classes from "./index.module.scss";
import { useSelectState } from "../../store/selectors";
import RequestManager from "../../store/request-manager";
import Header from "../../components/Header";
import { forgotPasswordActions } from "../../store/slices/forgotPassword.slice";
import sanitizeDigit from "../../utils/sanitizeDigit";
import useFocus from "../../hooks/useFocus";
import forgotPasswordAsyncActions from "../../store/actions/forgotPassword.action";
import CodeNotReceivedModal from "./CodeNotReceivedModal";

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
      <CodeNotReceivedModal
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        setIsVisible={setShowBottomSheet}
        isVisible={showBottomSheet}
      />
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
