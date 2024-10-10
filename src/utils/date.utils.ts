import { zeroPadding } from './common.utils';

const getTimeString = (date: Date) => {
  const hours: string = zeroPadding(date.getHours());
  const minutes: string = zeroPadding(date.getMinutes());
  const seconds: string = zeroPadding(date.getSeconds());
  const miliseconds: string = zeroPadding(date.getMilliseconds(), 3);

  return `${hours}:${minutes}:${seconds}.${miliseconds}`;
};

export const getDateFormat = (date: Date) => {
  return getTimeString(date);
};
