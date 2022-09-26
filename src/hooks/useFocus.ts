import React from "react";

const useFocus = (): [React.MutableRefObject<null>, () => void] => {
  const htmlElRef = React.useRef(null);
  const setFocus = () => {
    htmlElRef.current && (htmlElRef.current as any)?.focus?.();
  };

  return [htmlElRef, setFocus];
};

export default useFocus;
