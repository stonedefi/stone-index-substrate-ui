import common from '../config/common.json';

describe('Common Test Suite', () => {
  it('common has at lease three value', () => {
    expect(Object.keys(common).length).toBeGreaterThanOrEqual(3);
  });

  it('the common has APP_NAME on it', () => {
    expect(Object.keys(common)).toContain('APP_NAME');
  });
});