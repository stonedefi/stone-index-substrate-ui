import types from '../config/types.json';

describe('Types Test Suite', () => {
  it('types has at lease three value', () => {
    expect(Object.keys(types).length).toBeGreaterThanOrEqual(3);
  });

  it('the common has Address,StoneIndexComponent,StoneIndex on it', () => {
    expect(Object.keys(types)).toContain('Address');
    expect(Object.keys(types)).toContain('StoneIndexComponent');
    expect(Object.keys(types)).toContain('StoneIndex');
  });

  it('StoneIndexComponent and StoneIndex has at lease two value', () => {
    expect(Object.keys(types.StoneIndexComponent).length).toBeGreaterThanOrEqual(2);
    expect(Object.keys(types.StoneIndex).length).toBeGreaterThanOrEqual(2);
  });
});