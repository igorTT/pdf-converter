import React, { useEffect, useState } from 'react';

interface VersionInfo {
  node: string;
  chrome: string;
  electron: string;
}

const SystemInfo: React.FC = () => {
  const [versions, setVersions] = useState<VersionInfo>({
    node: 'Loading...',
    chrome: 'Loading...',
    electron: 'Loading...',
  });

  // This would normally fetch version info via Electron API
  // For now just setting some placeholder values
  useEffect(() => {
    // Simulate fetching version information
    const timer = setTimeout(() => {
      setVersions({
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron,
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="info-section">
      <h2>System Information</h2>
      <p>This app is using:</p>
      <ul>
        <li>
          Node.js <span>{versions.node}</span>
        </li>
        <li>
          Chromium <span>{versions.chrome}</span>
        </li>
        <li>
          Electron <span>{versions.electron}</span>
        </li>
      </ul>
    </section>
  );
};

export default SystemInfo;
