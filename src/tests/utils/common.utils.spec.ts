import { CommonUtils } from '../../utils/common.utils';

describe('common utility test', () => {
  it('should return the correct value for zeroPadding', () => {
    expect(CommonUtils.zeroPadding(3)).toEqual('03');
    expect(CommonUtils.zeroPadding(10)).toEqual('10');
    expect(CommonUtils.zeroPadding('7')).toEqual('07');
    expect(CommonUtils.zeroPadding('99')).toEqual('99');
    expect(CommonUtils.zeroPadding(6, 3)).toEqual('006');
    expect(CommonUtils.zeroPadding(18, 3)).toEqual('018');
    expect(CommonUtils.zeroPadding(120, 3)).toEqual('120');
    expect(CommonUtils.zeroPadding(1500, 3)).toEqual('1500');
  });
});
