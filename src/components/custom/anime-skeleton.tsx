import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { AnimeCardSkeleton } from '@/components/custom/anime-card';

interface AnimeSkeletonProps {
    count?: number;
    type?: 'vertical' | 'horizontal';
    className?:
        | string
        | ((index: number, type: 'vertical' | 'horizontal') => string);
}

const AnimeSkeleton: React.FC<AnimeSkeletonProps> = memo(
    ({ count = 10, type = 'vertical', className }) =>
        Array.from({ length: count }, (_, index) => (
            <AnimeCardSkeleton
                type={type}
                key={index}
                className={cn(
                    typeof className === 'string'
                        ? className
                        : className?.(index, type)
                )}
            />
        ))
);

AnimeSkeleton.displayName = 'AnimeSkeleton';

export default AnimeSkeleton;
