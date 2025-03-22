# AI Assistant Guide for Electron React TypeScript Application

This document is designed to help AI assistants understand the codebase structure and provide guidance on working with this application.

## Project Overview

This is an Electron application with React and TypeScript that follows modern development practices, including:

- TypeScript for type safety
- React for the UI components
- Vite for fast development and bundling
- Jest for testing
- Electron for cross-platform desktop capabilities
- Modular architecture with clear separation of concerns

## Key Files and Directories

- **electron/main.ts**: Main process entry point
- **electron/preload.ts**: Preload script for secure main-to-renderer communication
- **src/main.tsx**: React application entry point
- **src/App.tsx**: Main React component
- **src/components/**: React UI components
- **src/styles/**: CSS styles for the application
- **tests/**: Test files mirroring the src/ structure
- **docs/**: Documentation including architecture and testing guides

## Architectural Patterns

### Process Separation

This application follows the standard Electron architecture:

1. **Main Process**: System-level operations, window management
2. **Renderer Process**: React UI and user interaction
3. **Preload Script**: Bridge for secure inter-process communication

### Build System

The application uses a dual-build system:

- TypeScript compiler for Electron main and preload scripts
- Vite for the React frontend
- Electron-builder for packaging the application

### Type Safety

All interfaces between processes should be clearly defined with TypeScript interfaces. For example:

```typescript
// Example of how to define interfaces for IPC
export interface MessageRequest {
  type: string;
  payload: unknown;
}

export interface MessageResponse {
  success: boolean;
  data?: unknown;
  error?: string;
}
```

### Testing Standards

When writing tests, please follow these principles:

- Tests should follow the Arrange-Act-Assert pattern
- Test files should mirror the source structure
- Each test should focus on a single behavior
- Use descriptive test names

See [Testing Guide](testing-guide.md) for more details.

## Recommendations for AI Assistants

### When Adding New Features

1. **Understand the Architecture**:

   - Review [Architecture Documentation](architecture.md)
   - Determine which process should own the feature

2. **Follow TypeScript Best Practices**:

   - Use proper typing for all functions and variables
   - Define interfaces for data structures
   - Avoid using `any` type

3. **React Best Practices**:

   - Use functional components with hooks
   - Keep components small and focused
   - Follow React patterns for state management

4. **Test-Driven Development**:

   - Write tests first or alongside implementation
   - Follow the testing standards in the [Testing Guide](testing-guide.md)
   - Run tests with `npm test`

5. **Code Organization**:
   - Keep files focused on a single responsibility
   - Place components in the appropriate directory
   - Follow existing patterns for naming and organization

### Node.js Version Requirements

- The application requires Node.js v18.13.0 or higher
- Using LTS/iron (v20.19.0) is recommended
- If using nvm, run `nvm use` to automatically switch to the correct version

### Common Patterns to Use

#### IPC Communication

For features requiring communication between main and renderer processes:

```typescript
// In electron/preload.ts
contextBridge.exposeInMainWorld('api', {
  sendMessage: (message: string) => ipcRenderer.invoke('send-message', message),
});

// In electron/main.ts
ipcMain.handle('send-message', async (event, message: string) => {
  // Process message
  return { success: true, response: 'Processed: ' + message };
});

// In React component
const sendMessage = async () => {
  const response = await window.api.sendMessage('Hello');
  setResult(response.response);
};
```

#### Adding React Components

If adding UI components, follow this pattern:

1. Create TypeScript interfaces for props/state
2. Create the component with proper typing
3. Write tests that verify behavior
4. Import and use the component in the appropriate place

```typescript
// Example React component with TypeScript
import React from 'react';

interface ButtonProps {
  onClick: () => void;
  label: string;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  label,
  disabled = false,
}) => {
  return (
    <button onClick={onClick} disabled={disabled} className="btn">
      {label}
    </button>
  );
};
```

### Development Workflow

- `npm run dev`: Start both Vite dev server and Electron
- `npm run dev:vite`: Start only the Vite development server
- `npm run dev:electron`: Compile Electron TypeScript files in watch mode
- `npm start`: Run the Electron app in development mode
- `npm run build`: Build the complete application for production

### Tips for Reviewing Code

When reviewing code in this project, look for:

- Proper TypeScript usage
- Adherence to architectural principles
- Test coverage for new features
- Security considerations, especially in IPC communication
- Performance implications
- React component best practices

## Documentation Maintenance

When adding significant features, please update:

1. This guide if needed
2. The Architecture document if architectural changes are made
3. The README.md if user-facing features are added

## References

- [Electron Documentation](https://www.electronjs.org/docs)
- [React Documentation](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
