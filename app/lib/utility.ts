export function truncateString(str, num) {
  if (str.length > num) {
    return str.slice(0, num) + "...";
  } else {
    return str;
  }
}

export function timeAgo(timestamp) {
  const now = new Date();
  const postDate = new Date(timestamp);
  const secondsAgo = Math.floor((now - postDate) / 1000);

  if (secondsAgo < 60) {
    return `${secondsAgo} seconds ago`;
  }

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) {
    return `${minutesAgo} minutes ago`;
  }

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) {
    return `${hoursAgo} hours ago`;
  }

  const daysAgo = Math.floor(hoursAgo / 24);
  if (daysAgo < 7) {
    return `${daysAgo} days ago`;
  }

  const weeksAgo = Math.floor(daysAgo / 7);
  if (weeksAgo < 4) {
    return `${weeksAgo} weeks ago`;
  }

  const monthsAgo = Math.floor(daysAgo / 30);
  if (monthsAgo < 12) {
    return `${monthsAgo} months ago`;
  }

  const yearsAgo = Math.floor(daysAgo / 365);
  return `${yearsAgo} years ago`;
}

export const splitIntoSyllables = (text) => {
  // Split the text into syllables using regular expressions
  const syllables = text?.split(/[\\s་།]+/);
  // Filter out empty syllables
  const filteredSplit = syllables?.filter((s) => s !== "");
  return filteredSplit;
};

export const calculatePay = (syllableCount) => {
  // Calculate pay based on the number of words
  return syllableCount * 0.5;
};
