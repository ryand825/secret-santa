import isEmpty from "./is-empty";

const validateDisplayName = (displayName: string) => {
  let errors = {};
  let isValid = true;
  const nameLength = { min: 2, max: 20 };

  if (
    isEmpty(displayName) ||
    displayName.length > nameLength.max ||
    displayName.length < nameLength.min
  ) {
    errors = {
      displayName: `Enter a display name between ${nameLength.min} and ${
        nameLength.max
      } characters.`
    };
    isValid = false;
  }

  return { errors, isValid };
};

export default validateDisplayName;
