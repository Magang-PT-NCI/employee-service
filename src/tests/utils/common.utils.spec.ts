import { zeroPadding } from '../../utils/common.utils';

describe('common utility test', () => {
  it('should return the correct value for zeroPadding', () => {
    expect(zeroPadding(3)).toEqual('03');
    expect(zeroPadding(10)).toEqual('10');
    expect(zeroPadding('7')).toEqual('07');
    expect(zeroPadding('99')).toEqual('99');
    expect(zeroPadding(6, 3)).toEqual('006');
    expect(zeroPadding(18, 3)).toEqual('018');
    expect(zeroPadding(120, 3)).toEqual('120');
    expect(zeroPadding(1500, 3)).toEqual('1500');
  });
});
