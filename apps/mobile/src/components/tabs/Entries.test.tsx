import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Entries from './Entries';

describe('<Entries />', () => {
  test('it should mount', () => {
    render(<Entries />);
    
    const entries = screen.getByTestId('Entries');

    expect(entries).toBeInTheDocument();
  });
});