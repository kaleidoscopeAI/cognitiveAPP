import '@testing-library/jest-dom';

// Mock focus-trap-react to avoid issues in tests
vi.mock('focus-trap-react', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));