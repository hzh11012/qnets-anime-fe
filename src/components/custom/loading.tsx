import React from 'react';
import RingLoader from 'react-spinners/RingLoader';
import { cn } from '@/lib/utils';

interface LoadingProps {
    className?: string;
    size?: number;
}

const Loading: React.FC<LoadingProps> = ({ className, size = 50 }) => {
    return (
        <div
            className={cn(
                'fixed top-0 left-0 w-full h-full flex items-center justify-center z-50',
                className
            )}
        >
            <RingLoader
                color="var(--primary)"
                size={size}
                aria-label="加载中"
                data-testid="loader"
            />
        </div>
    );
};
Loading.displayName = 'Loading';

export default Loading;
