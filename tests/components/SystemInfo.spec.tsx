import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import SystemInfo from '../../src/components/SystemInfo';

// Mock the process.versions object
const originalProcessVersions = process.versions;

describe('SystemInfo Component', () => {
  beforeEach(() => {
    jest.useFakeTimers();

    // Mock process.versions with default values
    Object.defineProperty(process, 'versions', {
      value: {
        node: '20.19.0',
        chrome: '108.0.0',
        electron: '30.0.0',
      },
      configurable: true,
    });
  });

  afterEach(() => {
    jest.useRealTimers();

    // Restore original process.versions
    Object.defineProperty(process, 'versions', {
      value: originalProcessVersions,
      configurable: true,
    });
  });

  it('should render loading state initially', () => {
    render(<SystemInfo />);

    const loadingNode = screen.getByText(/Node\.js/i);
    expect(loadingNode.textContent).toMatch(/Node\.js\s+Loading/i);

    const loadingChrome = screen.getByText(/Chromium/i);
    expect(loadingChrome.textContent).toMatch(/Chromium\s+Loading/i);

    const loadingElectron = screen.getByText(/Electron/i);
    expect(loadingElectron.textContent).toMatch(/Electron\s+Loading/i);
  });

  it('should update with system version information after loading', async () => {
    render(<SystemInfo />);

    // Fast-forward timers to trigger the setTimeout callback
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check the node version is displayed
    const nodeText = screen.getByText(/Node\.js/i);
    expect(nodeText.textContent).toContain('20.19.0');

    // Check Chromium and Electron version texts
    const chromiumEl = screen.getByText(/Chromium/i);
    expect(chromiumEl.textContent).toContain('108.0.0');

    const electronEl = screen.getByText(/Electron/i);
    expect(electronEl.textContent).toContain('30.0.0');
  });

  // Edge case: Missing version data
  it('should handle missing version information gracefully', async () => {
    // Set missing values for versions
    Object.defineProperty(process, 'versions', {
      value: {
        node: undefined,
        chrome: null,
        electron: '',
      },
      configurable: true,
    });

    render(<SystemInfo />);

    // Fast-forward timers to trigger the setTimeout callback
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    // Check that the component handles missing data properly
    const nodeText = screen.getByText(/Node\.js/i);
    expect(nodeText.textContent).not.toContain('undefined');

    const chromiumEl = screen.getByText(/Chromium/i);
    expect(chromiumEl.textContent).not.toContain('null');

    const electronEl = screen.getByText(/Electron/i);
    // Check that the element exists but doesn't show 'undefined' or other error text
    expect(electronEl).toBeInTheDocument();
    expect(electronEl.textContent).not.toContain('undefined');
  });

  // Edge case: Processing delay
  it('should continue showing loading state during long processing', () => {
    render(<SystemInfo />);

    // Only advance timers partially, simulating a delay in the process
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Should still be in loading state
    const loadingNode = screen.getByText(/Node\.js/i);
    expect(loadingNode.textContent).toMatch(/Node\.js\s+Loading/i);

    const loadingChrome = screen.getByText(/Chromium/i);
    expect(loadingChrome.textContent).toMatch(/Chromium\s+Loading/i);
  });
});
