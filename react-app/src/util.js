export const randomSample = (arr, size) => {
  const copy = arr.slice();
  let i = arr.length, temp, idx;
  while (i--) {
    idx = Math.floor(i * Math.random());
    temp = copy[idx];
    copy[idx] = copy[i];
    copy[i] = temp;
  }
  return copy.slice(0, size);
};
