import { zeroPadding } from './common.utils';

export const getDateString = (date: Date) => {
  const year: string = zeroPadding(date.getFullYear(), 4);
  const month: string = zeroPadding(date.getMonth() + 1, 2);
  const day: string = zeroPadding(date.getDate(), 2);

  return `${year}-${month}-${day}`;
};

export const getTimeString = (date: Date) => {
  const hours: string = zeroPadding(date.getHours());
  const minutes: string = zeroPadding(date.getMinutes());
  const seconds: string = zeroPadding(date.getSeconds());
  const miliseconds: string = zeroPadding(date.getMilliseconds(), 3);

  return `${hours}:${minutes}:${seconds}.${miliseconds}`;
};

export const getDateFormat = (date: Date, isShowDate: boolean = false) => {
  return isShowDate
    ? `${getDateString(date)} ${getTimeString(date)}`
    : getTimeString(date);
};
