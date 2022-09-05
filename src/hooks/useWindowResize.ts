import React from "react";

export const useWindowResize = () => {
  const [windowSize, setWindowSize] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
    isSmallDevice: window.innerWidth <= 768,
    isSmallerDevice: window.innerWidth <= 576,
  });

  React.useEffect(() => {
    const getWindowSize = () => ({
      width: window.innerWidth,
      height: window.innerHeight,
      isSmallDevice: window.innerWidth <= 768,
      isSmallerDevice: window.innerWidth <= 576,
    });
    const handleResize = () => setWindowSize(getWindowSize());
    const handleResizeDebounce = debounce(100, handleResize);

    window.addEventListener("resize", handleResizeDebounce);
    return () => window.removeEventListener("resize", handleResizeDebounce);
  }, []);

  return windowSize;
};

const debounce = (
  n: number,
  fn: (...params: any[]) => any,
  immed: boolean = false
) => {
  let timer: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    if (timer === undefined && immed) {
      fn.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), n);
    return timer;
  };
};
