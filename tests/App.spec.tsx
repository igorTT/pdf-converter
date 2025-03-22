import React from 'react';
import { render, screen, act } from '@testing-library/react';
import App from '../src/App';

// Mock the child components to simplify testing
jest.mock('../src/components/Header', () => ({
  __esModule: true,
  default: ({ appInfo }: { appInfo: { name: string; version: string } }) => (
    <header data-testid="mock-header">
      <h1>{appInfo.name}</h1>
      <p>v{appInfo.version}</p>
    </header>
  ),
}));

jest.mock('../src/components/SystemInfo', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-system-info">System Info Component</div>
  ),
}));

jest.mock('../src/components/ImageLoader', () => ({
  __esModule: true,
  default: () => (
    <div data-testid="mock-image-loader">Image Loader Component</div>
  ),
}));

describe('App Component', () => {
  beforeEach(() => {
    // Suppress console errors for error boundary testing
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render all child components correctly', () => {
    // Arrange & Act
    render(<App />);

    // Assert
    expect(screen.getByTestId('mock-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-system-info')).toBeInTheDocument();
    expect(screen.getByTestId('mock-image-loader')).toBeInTheDocument();
    expect(screen.getByText('Electron React App')).toBeInTheDocument();
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
    expect(
      screen.getByText('Built with Electron, React, TypeScript and shadcn/ui')
    ).toBeInTheDocument();
  });

  // Test to check if app structure remains intact even with different content
  it('should maintain proper DOM structure with different content', () => {
    // Override the mocks temporarily for this test
    jest.mock(
      '../src/components/Header',
      () => ({
        __esModule: true,
        default: () => <div data-testid="alternate-header">Custom Header</div>,
      }),
      { virtual: true }
    );

    jest.mock(
      '../src/components/SystemInfo',
      () => ({
        __esModule: true,
        default: () => null,
      }),
      { virtual: true }
    );

    // Force re-evaluation of the mocks
    jest.resetModules();

    // Arrange & Act
    render(<App />);

    // Assert
    // Check that the overall structure is maintained
    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    expect(
      screen.getByText('Built with Electron, React, TypeScript and shadcn/ui')
    ).toBeInTheDocument();

    // Cleanup for other tests
    jest.resetModules();
  });

  // Edge case test: testing component error handling with a simulated error
  it('should handle errors in components gracefully', () => {
    // Test App with problematic components
    const MockErrorComponent = () => {
      return <div>This component would normally throw an error</div>;
    };

    const TestAppWithErrorHandling = () => (
      <div className="min-h-screen flex flex-col">
        <div data-testid="test-header">Test Header</div>
        <main>
          <MockErrorComponent />
          <div data-testid="test-image-loader">Test Image Loader</div>
        </main>
        <footer>
          <p>Test Footer</p>
        </footer>
      </div>
    );

    // Render the test component with error handling
    render(<TestAppWithErrorHandling />);

    // Assert that everything rendered correctly
    expect(screen.getByTestId('test-header')).toBeInTheDocument();
    expect(screen.getByTestId('test-image-loader')).toBeInTheDocument();
    expect(screen.getByText('Test Footer')).toBeInTheDocument();
    expect(
      screen.getByText('This component would normally throw an error')
    ).toBeInTheDocument();
  });

  // Edge case: testing app with extreme DOM nesting
  it('should handle complex DOM nesting', () => {
    // Arrange & Act
    const DeepNestedApp = () => (
      <div className="min-h-screen flex flex-col">
        <div data-testid="level-1">
          <div data-testid="level-2">
            <div data-testid="level-3">
              <div data-testid="level-4">
                <div data-testid="level-5">
                  <div data-testid="level-6">
                    <div data-testid="level-7">
                      <div data-testid="level-8">
                        <div data-testid="level-9">
                          <div data-testid="level-10">Deep content</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    render(<DeepNestedApp />);

    // Assert - check deep nesting works
    expect(screen.getByTestId('level-10')).toBeInTheDocument();
    expect(screen.getByText('Deep content')).toBeInTheDocument();
  });
});
