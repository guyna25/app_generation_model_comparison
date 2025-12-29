const NAME_MIN = 4;
const NAME_MAX = 100;
const DESC_MAX = 500;

export const validateTitle = (value: string): boolean => {
  return value.length >= NAME_MIN && value.length <= NAME_MAX;
};

export const validateDescription = (value: string): boolean => {
  return value.length <= DESC_MAX;
};

