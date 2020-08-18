import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TabTwo from './TabTwo';

describe('<TabTwo />', () => {
  test('it should mount', () => {
    render(<TabTwo />);
    
    const tabTwo = screen.getByTestId('TabTwo');

    expect(tabTwo).toBeInTheDocument();
  });
});