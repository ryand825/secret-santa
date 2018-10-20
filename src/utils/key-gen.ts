import Session from "../models/Session";

const keyGen = (keyLength: number = 5) => {
  let accessKey: string[] = []; // Key array
  let characters: string = "ABCDFHKLMNPQRSTUVWXYZ"; // Available characters for key

  for (let i = 0; i < keyLength; i++) {
    let randomCharPos = Math.floor(Math.random() * characters.length);
    accessKey[i] = characters.charAt(randomCharPos);
    characters =
      characters.slice(0, randomCharPos) +
      characters.slice(randomCharPos + 1, characters.length);
  }

  // convert key array to a string
  const keyString: string = accessKey.join().replace(/,/g, "");

  return Session.findOne({ accessKey: accessKey }).then(session => {
    if (session) {
      return keyGen(); //If key already exists in DB, try again
    } else {
      return keyString; //If it doesn't, return new key
    }
  });
};

export default keyGen;
