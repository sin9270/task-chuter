const milliSecToHhmmssms = (milliSeconds: number): string => {
  const hour = Math.floor(milliSeconds / (60 * 60 * 1000));
  const minute = Math.floor((milliSeconds % (60 * 60 * 1000)) / (60 * 1000));
  const second = Math.floor((milliSeconds % (60 * 1000)) / 1000);
  const milliSecond = Math.floor(milliSeconds % 1000);

  const hh = ('00' + hour).slice(-2);
  const mm = ('00' + minute).slice(-2);
  const ss = ('00' + second).slice(-2);
  const ms = ('000' + milliSecond).slice(-3, -2);

  const formatedTime = `${hh}:${mm}:${ss}.${ms}`;
  return formatedTime;
};

export { milliSecToHhmmssms };
