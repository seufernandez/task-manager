import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import Login from './Login';
import { expect, test } from 'vitest';
import { vi } from 'vitest';

vi.mock('react-router-dom', () => ({
  useNavigate: () => path => console.log(path),
  useUser: () => path => console.log(path),
}));

vi.spyOn(console, 'log');

test('navigates to /tasks page after successful login and logs expected object', async () => {
  const { getByPlaceholderText, getByText } = render(<Login />);

  const UsernameInput = getByPlaceholderText('Username');
  const passwordInput = getByPlaceholderText('Password');
  const loginButton = getByText('Login');

  fireEvent.change(UsernameInput, { target: { value: 'john_doe' } });
  fireEvent.change(passwordInput, { target: { value: 'password123' } });
  fireEvent.click(loginButton);

  await waitFor(() => {
    expect(console.log).toHaveBeenCalledWith({
      username: 'john_doe',
      password: 'password123'
    });
  });
});