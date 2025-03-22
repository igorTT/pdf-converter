import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { MonitorIcon, ServerIcon } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

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
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Card className="w-full max-w-md mx-auto shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ServerIcon className="h-5 w-5" />
          System Information
        </CardTitle>
        <CardDescription>
          Technical details about your environment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MonitorIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Node.js</span>
            </div>
            {loading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <span className="text-sm font-medium">{versions.node}</span>
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MonitorIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Chromium</span>
            </div>
            {loading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <span className="text-sm font-medium">{versions.chrome}</span>
            )}
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MonitorIcon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Electron</span>
            </div>
            {loading ? (
              <Skeleton className="h-4 w-20" />
            ) : (
              <span className="text-sm font-medium">{versions.electron}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemInfo;
