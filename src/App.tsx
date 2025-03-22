import React, { useState } from 'react';
import ImageLoader from './components/ImageLoader';
import SystemInfo from './components/SystemInfo';
import Header from './components/Header';
import './styles/App.css';

const App: React.FC = () => {
  const [appInfo, setAppInfo] = useState<{ name: string; version: string }>({
    name: 'Electron React App',
    version: '1.0.0',
  });

  return (
    <div className="app">
      <Header appInfo={appInfo} />
      <main className="main-content">
        <SystemInfo />
        <ImageLoader />
      </main>
      <footer className="footer">
        <p>Built with Electron, React, and TypeScript</p>
      </footer>
    </div>
  );
};

export default App;
