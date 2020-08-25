import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Capture from './Capture';

describe('<Capture />', () => {
  test('it should mount', () => {
    render(<Capture />);
    
    const capture = screen.getByTestId('Capture');

    expect(capture).toBeInTheDocument();
  });
});