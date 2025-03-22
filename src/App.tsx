import React, { useState, useEffect } from 'react';
import ImageLoader from './components/ImageLoader';
import SystemInfo from './components/SystemInfo';
import Header from './components/Header';
import './styles/App.css';

const App: React.FC = () => {
  const [appInfo] = useState<{ name: string; version: string }>({
    name: 'Electron React App',
    version: '1.0.0',
  });

  // Apply dark mode to the html element
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-800 via-background to-background -z-10" />

      <Header appInfo={appInfo} />

      <main className="flex-1 py-6 px-4 md:py-8 md:px-6 space-y-8 container max-w-5xl mx-auto">
        <div className="grid gap-6 md:grid-cols-2">
          <SystemInfo />
          <ImageLoader />
        </div>
      </main>

      <footer className="py-6 border-t border-border/40">
        <div className="container max-w-5xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Built with Electron, React, TypeScript and shadcn/ui</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
