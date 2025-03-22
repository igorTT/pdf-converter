# Testing Guide

This document outlines the testing guidelines and best practices for the Electron TypeScript application.

## Testing Philosophy

- **Test Behavior, Not Implementation**: Focus on testing what functions do, not how they do it.
- **Keep Tests Simple**: Each test should verify one specific behavior.
- **Arrange-Act-Assert**: Structure tests using the AAA pattern.
- **Descriptive Test Names**: Test names should clearly describe what is being tested.

## Test Structure

### File Organization

- Test files should mirror the source file structure
- Test files should be named with `.spec.ts` extension
- Test files should be placed in the `tests` directory

Example:

```
src/utils/validation.ts → tests/utils/validation.spec.ts
```

### Test Case Structure

Use the following structure for writing tests:

```typescript
describe('ComponentName or FunctionName', () => {
  // Setup (if needed)

  describe('methodName or scenario', () => {
    it('should behave in a certain way under specific conditions', () => {
      // Arrange: Set up test data and conditions
      const input = 'example';

      // Act: Call the function/method being tested
      const result = myFunction(input);

      // Assert: Verify the expected outcome
      expect(result).toBe(expectedValue);
    });
  });
});
```

## Mock Patterns

### Mocking Dependencies

Use Jest's mocking capabilities to isolate the code being tested:

```typescript
// Import the module with the function to mock
import * as utils from '../utils';

// Mock the module
jest.mock('../utils', () => ({
  helperFunction: jest.fn().mockReturnValue('mocked value'),
}));
```

### Electron-Specific Mocking

For Electron-specific APIs:

```typescript
// Mock Electron modules
jest.mock('electron', () => ({
  app: {
    on: jest.fn(),
    quit: jest.fn(),
  },
  BrowserWindow: jest.fn().mockImplementation(() => ({
    loadFile: jest.fn(),
    webContents: {
      openDevTools: jest.fn(),
    },
  })),
}));
```

## Test Coverage

Aim for high test coverage but prioritize testing critical paths and edge cases:

- Business logic: 90%+ coverage
- UI components: 70%+ coverage
- Utility functions: 95%+ coverage

Run coverage reports to identify gaps:

```bash
npm test
```

## Best Practices

1. **Keep Tests Independent**: Tests should not depend on each other
2. **Use Real Data When Possible**: Avoid excessive mocking
3. **Test Both Success and Failure Cases**: Cover both happy and error paths
4. **Test Edge Cases**: Test boundary conditions and special inputs
5. **Clean Up After Tests**: Reset any global state after each test

## Continuous Integration

Tests are run automatically in CI for:

- Pull requests to main branch
- Push to main branch
- Nightly builds

## Testing Checklist

Use this checklist when writing tests:

- [ ] Tests are easy to understand
- [ ] Tests cover happy path and edge cases
- [ ] Mocks are used appropriately
- [ ] Tests follow the AAA pattern
- [ ] Tests use descriptive names
- [ ] Tests don't include implementation details
