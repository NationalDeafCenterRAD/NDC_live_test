import { render } from '@testing-library/react';
import App from './components/navbar.js';

test('renders the landing page', () => {
  render(<App />);
});