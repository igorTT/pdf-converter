'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, LucideProps } from 'lucide-react';

const spinnerVariants = 'animate-spin text-primary';

interface LoadingSpinnerProps extends LucideProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const LoadingSpinner = React.forwardRef<SVGSVGElement, LoadingSpinnerProps>(
  ({ className, size = 'md', ...props }, ref) => {
    return (
      <Loader2
        ref={ref}
        className={cn(spinnerVariants, sizeMap[size], className)}
        {...props}
      />
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

export { LoadingSpinner };
