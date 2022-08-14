export const wrapText = (text: string, limit: number) => {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}...`;
};
