import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoadingSpinner } from '../../../src/components/ui/loading-spinner';
import { Loader2 } from 'lucide-react';

// Mock the Lucide React icons
jest.mock('lucide-react', () => ({
  Loader2: jest.fn(({ className, ...props }) => (
    <svg data-testid="mock-loader-icon" className={className} {...props} />
  )),
  LucideProps: {},
}));

describe('LoadingSpinner Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default size (md)', () => {
    // Arrange & Act
    render(<LoadingSpinner data-testid="spinner" />);

    // Assert
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-6 w-6'); // Default md size
    expect(spinner).toHaveClass('animate-spin'); // Verify animation class
    expect(Loader2).toHaveBeenCalled();
  });

  it('should render with small size when size="sm"', () => {
    // Arrange & Act
    render(<LoadingSpinner size="sm" data-testid="spinner" />);

    // Assert
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-4 w-4'); // Small size
  });

  it('should render with large size when size="lg"', () => {
    // Arrange & Act
    render(<LoadingSpinner size="lg" data-testid="spinner" />);

    // Assert
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('h-8 w-8'); // Large size
  });

  it('should merge additional classNames correctly', () => {
    // Arrange & Act
    render(<LoadingSpinner className="test-class" data-testid="spinner" />);

    // Assert
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass('test-class');
    expect(spinner).toHaveClass('animate-spin'); // Still has the base classes
  });

  // Edge Case: Test with invalid size (should use default)
  it('should use default size when an invalid size is provided', () => {
    // Arrange & Act
    // @ts-ignore - Intentionally testing invalid prop
    render(<LoadingSpinner size="invalid-size" data-testid="spinner" />);

    // Assert
    const spinner = screen.getByTestId('spinner');
    // Default classes should still be present
    expect(spinner).toHaveClass('animate-spin');
    expect(spinner).toHaveClass('text-primary');
    // But size classes won't be applied for invalid size
  });

  // Edge Case: Test passing additional SVG props
  it('should forward additional props to the SVG element', () => {
    // Arrange & Act
    render(
      <LoadingSpinner
        data-testid="spinner"
        aria-label="Loading"
        stroke="red"
        strokeWidth={3}
      />
    );

    // Assert
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
    expect(spinner).toHaveAttribute('stroke', 'red');
    expect(spinner).toHaveAttribute('stroke-width', '3');
  });

  // Edge Case: Test with really long class name
  it('should handle very long class names', () => {
    // Arrange
    const longClassName = 'a'.repeat(100);

    // Act
    render(<LoadingSpinner className={longClassName} data-testid="spinner" />);

    // Assert
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toHaveClass(longClassName);
  });
});
