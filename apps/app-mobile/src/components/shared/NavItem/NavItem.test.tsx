import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NavItem from './NavItem';

describe('<NavItem />', () => {
  test('it should mount', () => {
    render(<NavItem />);
    
    const navItem = screen.getByTestId('NavItem');

    expect(navItem).toBeInTheDocument();
  });
});