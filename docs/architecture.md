# Electron React TypeScript Application Architecture

This document describes the core architecture and design principles of this Electron TypeScript application with React frontend.

## Application Structure

This application follows a standard Electron architecture with:

- **Main Process**: Node.js process that controls the application lifecycle
- **Renderer Process**: Chromium-based process with React that renders the UI
- **Preload Scripts**: Bridge between main and renderer processes

## Core Components

### Main Process (`electron/main.ts`)

The main process is responsible for:

- Application lifecycle management
- Window creation and management
- Native OS integration
- IPC (Inter-Process Communication) handling
- File system access through secure APIs

Key principles:

- Keep the main process lean and focused on system-level tasks
- Defer UI logic to the renderer process
- Use TypeScript interfaces for all IPC communications

### Renderer Process (`src/`)

The renderer process, built with React and TypeScript, handles:

- UI rendering and updates
- User interaction
- Business logic related to UI

Key principles:

- Use TypeScript for type safety
- Follow a modular approach for React components
- Keep UI and logic separate using React patterns

### Preload Script (`electron/preload.ts`)

The preload script:

- Exposes selected Node.js APIs to the renderer process
- Provides a secure bridge between main and renderer processes
- Sets up contextBridge for IPC

Key principles:

- Expose only what's necessary
- Validate all data passing between processes
- Use TypeScript interfaces for API contracts

## Build System

The application uses a dual-build system:

1. **Vite**: Builds the React frontend (renderer process)
2. **TypeScript Compiler**: Compiles the Electron main and preload scripts
3. **Electron Builder**: Packages the application for distribution

Configuration files:

- `tsconfig.json`: Main TypeScript configuration
- `tsconfig.electron.json`: TypeScript configuration for Electron files
- `vite.config.ts`: Vite configuration for the React frontend build
- Build settings in `package.json` for electron-builder

## Development Guidelines

### Architecture Principles

1. **Separation of Concerns**

   - Main process handles system interactions
   - Renderer process handles UI and user interactions
   - Preload bridges between them securely

2. **Type Safety**

   - Use TypeScript interfaces for all data structures
   - Define clear contracts between processes
   - Avoid `any` types

3. **Security**
   - Use contextIsolation and proper IPC patterns
   - Validate all data crossing process boundaries
   - Follow Electron security best practices

### Code Organization

- **electron/**: Main process and preload script files
- **src/components/**: React components for the UI
- **src/styles/**: CSS styles for the application
- **src/**: React application code (App.tsx, main.tsx)
- **dist/**: Built React files
- **dist-electron/**: Built Electron files

### Adding New Features

When adding new features:

1. Determine which process should own the feature
2. Define TypeScript interfaces for any data structures
3. Implement in a modular, testable way
4. Add appropriate tests following testing guidelines
5. Update documentation

## IPC Communication Pattern

For features requiring IPC:

1. Define interfaces in a shared location:

   ```typescript
   // src/types/ipc.ts
   export interface SomeRequest {
     action: string;
     data: string;
   }

   export interface SomeResponse {
     success: boolean;
     result: string;
   }
   ```

2. Expose APIs in preload:

   ```typescript
   // electron/preload.ts
   contextBridge.exposeInMainWorld('api', {
     performAction: (request: SomeRequest) =>
       ipcRenderer.invoke('perform-action', request),
   });
   ```

3. Handle in main process:
   ```typescript
   // electron/main.ts
   ipcMain.handle(
     'perform-action',
     async (event, request: SomeRequest): Promise<SomeResponse> => {
       // Validate request
       // Perform action
       return { success: true, result: 'Action completed' };
     }
   );
   ```

## Testing Strategy

See [Testing Guide](testing-guide.md) for detailed testing guidelines.

## Performance Considerations

- Minimize IPC calls (they have overhead)
- Use async/await for non-blocking operations
- Avoid heavy computations in the renderer process
- Consider worker threads for CPU-intensive tasks

## Electron Best Practices

- Keep the main process lean
- Use proper security measures (contextIsolation, etc.)
- Follow the security checklist from Electron documentation
- Properly manage application resources and lifecycle events

## Node.js Version Compatibility

- The application requires Node.js v18.13.0 or higher
- Using LTS/iron (v20.19.0) is recommended
- The `.nvmrc` file can be used with nvm to automatically switch to the correct version
