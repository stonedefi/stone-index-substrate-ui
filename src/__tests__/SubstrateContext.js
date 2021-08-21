import { render, screen } from '@testing-library/react';
import { SubstrateContextProvider, useSubstrate } from '../substrate-lib/SubstrateContext';

function TestComponent() {
  const { apiState, keyringState } = useSubstrate();
  return (
    <>
      <div data-testid='apiState'>{apiState}</div>
      <div data-testid='keyringState'>{keyringState}</div>
    </>
  )
}

describe('SubstrateContext Test Suite', () => {
  it('SubstrateContextProvider and useSubstrate should work fine', () => {
    render(<SubstrateContextProvider>
      <TestComponent />
    </SubstrateContextProvider>);
    const apiState = screen.getByTestId('apiState');
    const keyringState = screen.getByTestId('keyringState');
    // should get correct value from Provider's value
    expect(apiState.textContent).toBe('CONNECT_INIT');
    expect(keyringState.textContent).toBe('LOADING');
  });
});