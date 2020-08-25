import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Settings from './Settings';

describe('<Settings />', () => {
  test('it should mount', () => {
    render(<Settings />);
    
    const settings = screen.getByTestId('Settings');

    expect(settings).toBeInTheDocument();
  });
});