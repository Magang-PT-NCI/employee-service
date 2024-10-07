import { getDateFormat } from '../../utils/date.utils';
import * as config from '../../config/logger.config';

jest.mock('../../config/logger.config', () => ({
  TRANSPORT: 'console',
  LEVEL: 'http',
  IS_SHOW_DATE: true,
}));

describe('date utility test', () => {
  it('should return date time string', () => {
    (config as any).IS_SHOW_DATE = true;
    const date = new Date();
    expect(getDateFormat(date)).toMatch(
      /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3}$/,
    );
  });

  it('should return time string only', () => {
    (config as any).IS_SHOW_DATE = false;
    const date = new Date();
    expect(getDateFormat(date)).toMatch(/^\d{2}:\d{2}:\d{2}\.\d{3}$/);
  });
});
