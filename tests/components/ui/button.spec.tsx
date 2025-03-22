import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button, buttonVariants } from '../../../src/components/ui/button';
import { Slot } from '@radix-ui/react-slot';

// Mock Slot component to verify it's being used
jest.mock('@radix-ui/react-slot', () => {
  return {
    Slot: jest.fn(({ children, ...props }) => (
      <div data-testid="slot-component" {...props}>
        {children}
      </div>
    )),
  };
});

describe('Button Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render as a button element by default', () => {
    // Arrange & Act
    render(<Button>Click me</Button>);

    // Assert
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
    expect(Slot).not.toHaveBeenCalled();
  });

  it('should render as a Slot when asChild is true', () => {
    // Arrange & Act
    render(<Button asChild>Click me</Button>);

    // Assert
    const slotElement = screen.getByTestId('slot-component');
    expect(slotElement).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(Slot).toHaveBeenCalled();
  });

  it('should apply different variants correctly', () => {
    // Arrange & Act
    const { rerender } = render(
      <Button variant="destructive">Destructive</Button>
    );

    // Assert
    let button = screen.getByRole('button', { name: 'Destructive' });
    expect(button).toHaveClass('bg-destructive');

    // Test another variant
    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole('button', { name: 'Outline' });
    expect(button).toHaveClass('border-input');

    // Test another variant
    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole('button', { name: 'Secondary' });
    expect(button).toHaveClass('bg-secondary');
  });

  it('should apply different sizes correctly', () => {
    // Arrange & Act
    const { rerender } = render(<Button size="sm">Small</Button>);

    // Assert
    let button = screen.getByRole('button', { name: 'Small' });
    expect(button).toHaveClass('h-8');

    // Test another size
    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button', { name: 'Large' });
    expect(button).toHaveClass('h-10');

    // Test another size
    rerender(<Button size="icon">Icon</Button>);
    button = screen.getByRole('button', { name: 'Icon' });
    expect(button).toHaveClass('h-9 w-9');
  });

  // Edge Case: Test with disabled state
  it('should apply disabled attribute and styling when disabled', () => {
    // Arrange & Act
    render(<Button disabled>Disabled Button</Button>);

    // Assert
    const button = screen.getByRole('button', { name: 'Disabled Button' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  // Edge Case: Test with empty children
  it('should handle empty children gracefully', () => {
    // Arrange & Act
    render(<Button></Button>);

    // Assert
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.textContent).toBe('');
  });

  // Edge Case: Test className merging with multiple classes
  it('should correctly merge multiple custom class names', () => {
    // Arrange & Act
    render(
      <Button className="custom-class-1 custom-class-2 custom-class-3">
        Custom Classes
      </Button>
    );

    // Assert
    const button = screen.getByRole('button', { name: 'Custom Classes' });
    expect(button).toHaveClass('custom-class-1');
    expect(button).toHaveClass('custom-class-2');
    expect(button).toHaveClass('custom-class-3');
    // Still has base classes
    expect(button).toHaveClass('inline-flex');
  });
});
