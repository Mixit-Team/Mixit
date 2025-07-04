import '@testing-library/jest-dom';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    query: {},
    asPath: '/',
    pathname: '/',
  }),
}));

beforeEach(() => {
  jest.clearAllMocks();
});
