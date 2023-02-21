export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const getMappedObject = <T extends object>(
  obj: T,
  ...keys: (keyof T)[]
) =>
  Object.entries(obj).reduce((prev, current) => {
    const [key, value] = current;

    if (keys.includes(key as keyof T)) return prev;

    return {
      ...prev,
      [key]: value,
    };
  }, {} as T);
