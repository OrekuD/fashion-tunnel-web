const sanitizeDigit = (value: string): string => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^0-9]/g, "");
};

export default sanitizeDigit;
