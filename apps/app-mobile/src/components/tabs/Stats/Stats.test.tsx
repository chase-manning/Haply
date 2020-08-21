import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Stats from './Stats';

describe('<Stats />', () => {
  test('it should mount', () => {
    render(<Stats />);
    
    const stats = screen.getByTestId('Stats');

    expect(stats).toBeInTheDocument();
  });
});