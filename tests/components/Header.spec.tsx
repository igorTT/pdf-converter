import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../../src/components/Header';

describe('Header Component', () => {
  const mockAppInfo = {
    name: 'Test App',
    version: '1.0.0',
  };

  it('should render the app name and version correctly', () => {
    // Arrange
    render(<Header appInfo={mockAppInfo} />);

    // Act - rendering is the action in this case

    // Assert
    expect(screen.getByText('Test App')).toBeInTheDocument();
    expect(screen.getByText('Version 1.0.0')).toBeInTheDocument();
  });

  it('should update displayed information when app info changes', () => {
    // Arrange
    const { rerender } = render(<Header appInfo={mockAppInfo} />);

    // Initial assertion
    expect(screen.getByText('Test App')).toBeInTheDocument();

    // Act - update props and re-render
    const updatedAppInfo = {
      name: 'Updated App',
      version: '2.0.0',
    };
    rerender(<Header appInfo={updatedAppInfo} />);

    // Assert
    expect(screen.getByText('Updated App')).toBeInTheDocument();
    expect(screen.getByText('Version 2.0.0')).toBeInTheDocument();
  });

  // Edge case: Empty strings for name and version
  it('should handle empty strings for app name and version', () => {
    // Arrange
    const emptyAppInfo = {
      name: '',
      version: '',
    };

    // Act
    render(<Header appInfo={emptyAppInfo} />);

    // Assert
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
    expect(screen.getByText('Version')).toBeInTheDocument();
    // Check that we have empty content but the structure is maintained
    const h1Element = header.querySelector('h1');
    expect(h1Element).not.toBeNull();
    expect(h1Element!.textContent).toBe('');
  });

  // Edge case: Very long text values
  it('should handle extremely long app name and version strings', () => {
    // Arrange
    const longAppInfo = {
      name: 'A'.repeat(1000), // Very long app name
      version: '1.'.repeat(500), // Very long version
    };

    // Act
    render(<Header appInfo={longAppInfo} />);

    // Assert
    const headerElement = screen.getByRole('banner');
    expect(headerElement).toBeInTheDocument();

    // Should render without crashing
    const headerTitle = headerElement.querySelector('h1');
    expect(headerTitle).not.toBeNull();
    expect(headerTitle!.textContent!.length).toBe(1000);

    // Version info should also render
    const versionText = screen.getByText(/Version/);
    expect(versionText).toBeInTheDocument();
    expect(versionText.textContent!.length).toBeGreaterThan(500); // "Version " + the long string
  });

  // Edge case: Special characters in app info
  it('should properly render special characters in app name and version', () => {
    // Arrange
    const specialCharAppInfo = {
      name: '特殊字符 & <script>alert("XSS")</script>',
      version: '1.0.0-β&<>"\'',
    };

    // Act
    render(<Header appInfo={specialCharAppInfo} />);

    // Assert
    expect(
      screen.getByText('特殊字符 & <script>alert("XSS")</script>')
    ).toBeInTheDocument();
    expect(screen.getByText('Version 1.0.0-β&<>"\'')).toBeInTheDocument();
  });
});
