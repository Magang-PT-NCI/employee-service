import { getDateFormat } from '../../utils/date.utils';

describe('date utility test', () => {
  it('should return correct value for getDateFormat', () => {
    const date = new Date();
    expect(getDateFormat(date)).toMatch(/^\d{2}:\d{2}:\d{2}\.\d{3}$/);
  });
});
