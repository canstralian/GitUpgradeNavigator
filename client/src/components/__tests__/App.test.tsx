
import { render, screen } from '@testing-library/react';
import App from '../../App';

// Mock wouter router
jest.mock('wouter', () => ({
  Router: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ component: Component }: { component: React.ComponentType }) => <Component />,
  Switch: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  useLocation: () => ['/', jest.fn()],
}));

// Mock query client
jest.mock('@tanstack/react-query', () => ({
  QueryClient: jest.fn(() => ({})),
  QueryClientProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    // This test will pass if the component renders without errors
    expect(document.body).toBeInTheDocument();
  });
});
