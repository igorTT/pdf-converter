# Electron React Image Loader

A desktop application built with Electron, React, and TypeScript that allows users to load and view images from their local filesystem.

## Features

- Load images from your local filesystem
- View images within the application
- Display information about the selected image
- Modern UI with React components

## Tech Stack

- **Electron**: For desktop application framework
- **React**: For UI components
- **TypeScript**: For type safety
- **Vite**: For fast development and bundling
- **CSS**: For styling

## Getting Started

### Prerequisites

- Node.js (v20.19.0 or later recommended)
- npm (v10.8.2 or later)

**Important Note:** This project requires Node.js v18.13.0 or higher. Lower versions will cause build errors.

### Installation

1. Clone this repository

   ```
   git clone <repository-url>
   cd electron-app
   ```

2. Use the correct Node.js version (if you have nvm installed)

   ```
   nvm use
   ```

3. Install dependencies

   ```
   npm install
   ```

4. Start the development server
   ```
   npm run dev
   ```

## Development Workflow

For development, use the following commands:

- `npm run dev`: Run both Vite dev server and Electron in development mode
- `npm run dev:vite`: Start only the Vite development server
- `npm run dev:electron`: Compile Electron TypeScript files in watch mode
- `npm start`: Run the Electron app in development mode
- `npm run start:debug`: Run the Electron app with debugging enabled

## Building for Production

To build the application for production:

```
npm run build
```

This creates distributable packages in the `release` directory.

Individual build steps:

- `npm run build:electron`: Compile Electron main process TypeScript files
- `npm run build:vite`: Build the React frontend
- `npm run build:app`: Package the application with electron-builder

## Project Structure

```
electron-app/
├── electron/           # Electron main process files
│   ├── main.ts         # Main process entry
│   └── preload.ts      # Preload script for IPC
├── src/                # React renderer process files
│   ├── components/     # React components
│   ├── styles/         # CSS styles
│   ├── App.tsx         # Main App component
│   └── main.tsx        # React entry point
├── dist/               # Built React files
├── dist-electron/      # Built Electron files
├── release/            # Packaged application outputs
├── docs/               # Documentation
│   ├── ai-assistant-guide.md  # Guide for AI assistants
│   ├── architecture.md        # Architecture documentation
│   └── testing-guide.md       # Testing guidelines
├── index.html          # HTML template
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── tsconfig.electron.json # TypeScript config for Electron
└── vite.config.ts      # Vite configuration
```

## Testing

Run the test suite with:

```
npm test
```

See the [Testing Guide](docs/testing-guide.md) for more information about testing standards and practices.

## Continuous Integration

This project uses GitHub Actions for continuous integration. The following workflows are set up:

- **Run Tests**: Runs tests automatically on the main branch and pull requests.
- **Cross-Platform Tests**: Tests the application on Ubuntu, macOS, and Windows (manual trigger only).
- **Build Electron App**: Builds the application and uploads artifacts (manual trigger only).

You can view the workflow status in the GitHub Actions tab of the repository.

## Documentation

Additional documentation is available in the `docs` directory:

- [AI Assistant Guide](docs/ai-assistant-guide.md): Guide for AI assistants working with this codebase
- [Architecture](docs/architecture.md): Architecture and design principles
- [Testing Guide](docs/testing-guide.md): Testing guidelines and best practices

## License

ISC

## Acknowledgments

- Electron documentation
- React documentation
- Vite documentation
