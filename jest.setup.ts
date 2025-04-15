import '@testing-library/jest-dom';
import '@testing-library/jest-dom/jest-globals';
import 'whatwg-fetch';

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

// Reset all mocks automatically between tests
beforeEach(() => {
  jest.clearAllMocks();
});
