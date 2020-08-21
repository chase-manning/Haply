import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Profile from './Profile';

describe('<Profile />', () => {
  test('it should mount', () => {
    render(<Profile />);
    
    const profile = screen.getByTestId('Profile');

    expect(profile).toBeInTheDocument();
  });
});