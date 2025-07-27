import React from 'react';
import Loading from '@/assets/loading.svg?react';
import { cn } from '@/lib/utils';

interface FallbackProps {
    className?: string;
}

const Fallback: React.FC<FallbackProps> = ({ className }) => {
    return (
        <div
            className={cn(
                'fixed top-0 left-0 w-full h-full flex items-center justify-center z-50',
                className
            )}
        >
            <Loading width="100%" />
        </div>
    );
};
Fallback.displayName = 'Fallback';

export default Fallback;
