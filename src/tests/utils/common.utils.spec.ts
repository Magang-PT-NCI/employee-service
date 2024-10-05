import {
  getPhotoUrl,
  validateToken,
  zeroPadding,
} from '../../utils/common.utils';
import { LoggerUtil } from '../../utils/logger.utils';
import { TokenPayload } from '../../interfaces/auth.interfaces';
import { verify } from 'jsonwebtoken';

jest.mock('jsonwebtoken');

describe('common utility test', () => {
  it('should return correct value for zeroPadding', () => {
    expect(zeroPadding(3)).toEqual('03');
    expect(zeroPadding(10)).toEqual('10');
    expect(zeroPadding('7')).toEqual('07');
    expect(zeroPadding('99')).toEqual('99');
    expect(zeroPadding(6, 3)).toEqual('006');
    expect(zeroPadding(18, 3)).toEqual('018');
    expect(zeroPadding(120, 3)).toEqual('120');
    expect(zeroPadding(1500, 3)).toEqual('1500');
  });

  it('should return correct value for validateToken', () => {
    const logger = new LoggerUtil('TestClass');
    const mockPayload: TokenPayload = { nik: '123' };

    (verify as jest.Mock).mockReturnValue(mockPayload);
    expect(validateToken('abc', logger)).toEqual(mockPayload);

    (verify as jest.Mock).mockImplementation(() => {
      throw new Error();
    });
    expect(validateToken('abc', logger)).toBeNull();
  });

  it('should return correct value for getPhotoUrl', () => {
    expect(getPhotoUrl('abcd')).toBe(
      `https://lh3.googleusercontent.com/d/abcd=s220`,
    );
  });
});
