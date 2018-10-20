import validateDisplayName from "./validateDisplayName";

const validateJoinGame = ({
  displayName,
  accessKey
}: {
  displayName: string;
  accessKey: string;
}) => {
  let errors = {};
  let isValid = true;
  const nameValid = validateDisplayName(displayName);
  if (!nameValid.isValid) {
    let errorCopy = {
      ...errors
    };
    errors = {
      ...errorCopy,
      ...nameValid.errors
    };
    isValid = false;
  }
  if (!accessKey || accessKey.length !== 5) {
    let errorCopy = {
      ...errors
    };
    errors = {
      ...errorCopy,
      accessKey: "5 Digit access key is required"
    };
    isValid = false;
  }

  return { isValid, errors };
};

export default validateJoinGame;
