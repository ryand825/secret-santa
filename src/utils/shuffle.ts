const shuffle = (array: any[], circular: Boolean = true) => {
  let shuffledArray: any[] = [...array];

  // "circular" argument refers to a circular gift exchange.
  // Meaning no two people will be gifting to each other.
  // defaults to true if the argument isn't passed in to the function
  const changeVar: number = circular ? 0 : 1;

  let i: number, j: number, tmp: string;

  for (i = shuffledArray.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + changeVar));
    tmp = shuffledArray[i];
    shuffledArray[i] = shuffledArray[j];
    shuffledArray[j] = tmp;
  }

  return shuffledArray;
};

export default shuffle;
