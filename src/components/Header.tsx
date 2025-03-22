import React from 'react';
import { CodeIcon } from 'lucide-react';

interface HeaderProps {
  appInfo: {
    name: string;
    version: string;
  };
}

const Header: React.FC<HeaderProps> = ({ appInfo }) => {
  return (
    <header className="border-b border-border/40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/50 py-3 px-4 sticky top-0 z-10">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <CodeIcon className="h-5 w-5 text-primary" />
          <h1 className="text-lg font-semibold tracking-tight text-foreground">
            {appInfo.name}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-md">
            v{appInfo.version}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
