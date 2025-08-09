import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { AnimeSearchCardSkeleton } from '@/pages/search/aniem-search-card';

interface AnimeSearchSkeletonProps {
    count?: number;
    className?: string;
}

const AnimeSearchSkeleton: React.FC<AnimeSearchSkeletonProps> = memo(
    ({ count = 10, className }) =>
        Array.from({ length: count }, (_, index) => (
            <AnimeSearchCardSkeleton key={index} className={cn(className)} />
        ))
);

AnimeSearchSkeleton.displayName = 'AnimeSearchSkeleton';

export default AnimeSearchSkeleton;
