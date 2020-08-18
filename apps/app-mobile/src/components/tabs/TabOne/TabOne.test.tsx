import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import TabOne from './TabOne';

describe('<TabOne />', () => {
  test('it should mount', () => {
    render(<TabOne />);
    
    const tabOne = screen.getByTestId('TabOne');

    expect(tabOne).toBeInTheDocument();
  });
});