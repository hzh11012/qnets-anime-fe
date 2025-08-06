import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { VideoCardSkeleton } from '@/components/custom/video-card';

interface VideoSkeletonProps {
    count?: number;
    className?: string;
}

const VideoSkeleton: React.FC<VideoSkeletonProps> = memo(
    ({ count = 10, className }) =>
        Array.from({ length: count }, (_, index) => (
            <VideoCardSkeleton key={index} className={cn(className)} />
        ))
);

VideoSkeleton.displayName = 'VideoSkeleton';

export default VideoSkeleton;
