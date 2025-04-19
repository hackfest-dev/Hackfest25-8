
export const generateId = (): string => {
  return "0x" + Math.random().toString(16).substring(2, 16) + Math.random().toString(16).substring(2, 16);
};

export const generateAddress = (): string => {
  return "0x" + Math.random().toString(16).substring(2, 42);
};

export const generateAmount = (): string => {
  return (Math.random() * 10).toFixed(4);
};

export const generateDate = (offset: number = 0): string => {
  const date = new Date(Date.now() - Math.random() * 86400000 - offset);
  return date.toLocaleString();
};
