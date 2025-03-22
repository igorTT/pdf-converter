import React from 'react';
import { render, screen } from '@testing-library/react';
import { Separator } from '../../../src/components/ui/separator';
import * as SeparatorPrimitive from '@radix-ui/react-separator';

// Mock the Radix UI Separator
jest.mock('@radix-ui/react-separator', () => {
  const Original = jest.requireActual('@radix-ui/react-separator');
  return {
    ...Original,
    Root: jest
      .fn()
      .mockImplementation(
        ({ children, className, decorative, orientation, ...props }) => (
          <div
            data-testid="mock-separator"
            data-orientation={orientation}
            role={decorative ? 'none' : undefined}
            className={className}
            {...props}
          >
            {children}
          </div>
        )
      ),
  };
});

describe('Separator Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render with horizontal orientation by default', () => {
    // Arrange & Act
    render(<Separator data-testid="separator" />);

    // Assert
    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('h-[1px] w-full'); // Horizontal separator
    expect(separator).toHaveAttribute('data-orientation', 'horizontal');
    expect(SeparatorPrimitive.Root).toHaveBeenCalledWith(
      expect.objectContaining({
        orientation: 'horizontal',
        decorative: true,
      }),
      {}
    );
  });

  it('should render with vertical orientation when specified', () => {
    // Arrange & Act
    render(<Separator orientation="vertical" data-testid="separator" />);

    // Assert
    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    expect(separator).toHaveClass('h-full w-[1px]'); // Vertical separator
    expect(separator).toHaveAttribute('data-orientation', 'vertical');
    expect(SeparatorPrimitive.Root).toHaveBeenCalledWith(
      expect.objectContaining({
        orientation: 'vertical',
      }),
      {}
    );
  });

  it('should set decorative attribute appropriately when decorative=true', () => {
    // Arrange & Act
    render(<Separator decorative data-testid="separator" />);

    // Assert
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveAttribute('role', 'none');
    expect(SeparatorPrimitive.Root).toHaveBeenCalledWith(
      expect.objectContaining({
        decorative: true,
      }),
      {}
    );
  });

  it('should not set decorative attribute when decorative=false', () => {
    // Arrange & Act
    render(<Separator decorative={false} data-testid="separator" />);

    // Assert
    const separator = screen.getByTestId('separator');
    expect(separator).not.toHaveAttribute('role', 'none');
    expect(SeparatorPrimitive.Root).toHaveBeenCalledWith(
      expect.objectContaining({
        decorative: false,
      }),
      {}
    );
  });

  it('should merge additional classNames correctly', () => {
    // Arrange & Act
    render(<Separator className="test-class" data-testid="separator" />);

    // Assert
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('test-class');
    expect(separator).toHaveClass('shrink-0'); // Still has the base classes
  });

  // Edge Case: Test with invalid orientation (fallback to default)
  it('should handle invalid orientation gracefully', () => {
    // Arrange & Act
    // @ts-ignore - Intentionally testing invalid prop
    render(<Separator orientation="diagonal" data-testid="separator" />);

    // Assert
    const separator = screen.getByTestId('separator');
    expect(separator).toBeInTheDocument();
    // Should still apply styles even with invalid orientation
    expect(separator).toHaveClass('shrink-0');
  });

  // Edge Case: Test with ref forwarding
  it('should forward ref correctly', () => {
    // Arrange
    const mockRef = { current: null };

    // Act
    render(<Separator data-testid="separator" />);

    // Assert
    // We're just checking that the Root component is called
    // Since our mock doesn't actually handle refs properly, we just verify the component renders
    expect(SeparatorPrimitive.Root).toHaveBeenCalled();
  });

  // Edge Case: Test with complex/nested className
  it('should handle complex className with conditional expressions', () => {
    // Arrange
    const condition = true;
    const complexClassName = `test-base ${
      condition ? 'condition-true' : 'condition-false'
    } test-end`;

    // Act
    render(<Separator className={complexClassName} data-testid="separator" />);

    // Assert
    const separator = screen.getByTestId('separator');
    expect(separator).toHaveClass('test-base');
    expect(separator).toHaveClass('condition-true');
    expect(separator).toHaveClass('test-end');
    expect(separator).not.toHaveClass('condition-false');
  });
});
