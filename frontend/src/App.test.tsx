import React from 'react';
import { render, screen } from '@testing-library/react';
import MealWeek from './MealWeek';

test('renders learn react link', () => {
  render(<MealWeek />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
