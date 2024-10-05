import { getDateFormat } from '../../utils/date.utils';

describe('date utility test', () => {
  it('should return date time string', () => {
    const date = new Date();
    expect(getDateFormat(date, true)).toMatch(
      /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}/,
    );
  });

  it('should return time string only', () => {
    const date = new Date();
    expect(getDateFormat(date, true)).toMatch(/\d{2}:\d{2}:\d{2}\.\d{3}/);
  });
});
