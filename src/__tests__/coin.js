import { coin } from '../config/coin';

describe('CoinConfig Test Suite', () => {
  it('coin has at lease one value', () => {
    expect(coin.length).toBeGreaterThan(0);
  });

  it('the coin has STN on it', () => {
    expect(coin).toContain('STN');
  });
});