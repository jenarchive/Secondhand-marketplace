import React from 'react';
import { render } from '@testing-library/react-native';

jest.mock('react-native/Libraries/Image/Image.ios', () => ({
  __esModule: true,
  default: () => null,
}));

import { Butterfly } from '../components/butterfly';

describe('Butterfly', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders without crashing flying right', () => {
    const onFinish = jest.fn();
    expect(() =>
      render(<Butterfly direction="right" onFinish={onFinish} />)
    ).not.toThrow();
  });

  it('renders without crashing flying left', () => {
    const onFinish = jest.fn();
    expect(() =>
      render(<Butterfly direction="left" onFinish={onFinish} />)
    ).not.toThrow();
  });

  it('accepts optional props without crashing', () => {
    const onFinish = jest.fn();
    expect(() =>
      render(
        <Butterfly
          direction="right"
          onFinish={onFinish}
          startX={100}
          startY={200}
          duration={5000}
          clusterIndex={3}
        />
      )
    ).not.toThrow();
  });
});
