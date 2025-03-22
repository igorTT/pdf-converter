import React from 'react';

interface HeaderProps {
  appInfo: {
    name: string;
    version: string;
  };
}

const Header: React.FC<HeaderProps> = ({ appInfo }) => {
  return (
    <header className="header">
      <h1>{appInfo.name}</h1>
      <p className="app-info">Version {appInfo.version}</p>
    </header>
  );
};

export default Header;
