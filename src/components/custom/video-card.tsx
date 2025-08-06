import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Heart, PlayCircle } from 'lucide-react';

interface VideoCardSkeletonProps {
    className?: string;
}

const VideoCardSkeleton: React.FC<VideoCardSkeletonProps> = memo(
    ({ className }) => {
        return (
            <div className={cn('flex', className)}>
                <Skeleton
                    className={cn(
                        'relative w-[140px] aspect-[16/9] mr-2.5 rounded-sm'
                    )}
                />
                <div className={cn('flex flex-col justify-between flex-1')}>
                    <Skeleton className={cn('relative w-36 h-4 rounded-sm')} />
                    <div className={cn('flex flex-col gap-2')}>
                        <Skeleton
                            className={cn('relative w-12 h-3 rounded-sm')}
                        />
                        <Skeleton
                            className={cn('relative w-24 h-3 rounded-sm')}
                        />
                    </div>
                </div>
            </div>
        );
    }
);

VideoCardSkeleton.displayName = 'VideoCardSkeleton';

interface VideoCardProps extends VideoCardSkeletonProps {
    title: string;
    image: string;
    remark: string;
    plays: number;
    collections: number;
    rating?: number;
    onClick: () => void;
}

const VideoCard: React.FC<VideoCardProps> = memo(
    ({
        title,
        image,
        remark,
        plays,
        collections,
        rating,
        className,
        onClick
    }) => {
        return (
            <div
                className={cn('flex', 'md:cursor-pointer', className)}
                onClick={onClick}
                title={title}
            >
                <div
                    className={cn(
                        'relative rounded-sm bg-cover bg-center overflow-hidden w-[140px] aspect-[16/9] mr-2.5'
                    )}
                    style={{
                        backgroundImage: `url("${image}")`
                    }}
                ></div>
                <div className={cn('flex flex-col justify-between flex-1')}>
                    <div
                        className={cn(
                            'w-fit line-clamp-2 text-sm text-foreground'
                        )}
                    >
                        {title}
                    </div>
                    <div
                        className={cn(
                            'flex flex-col text-xs text-muted-foreground'
                        )}
                    >
                        <div className={cn('line-clamp-1')}>{remark}</div>
                        <div className={cn('flex items-center gap-2')}>
                            <div className={cn('flex items-center gap-1')}>
                                <PlayCircle size={12} />
                                <span>{plays}</span>
                            </div>
                            <div className={cn('flex items-center gap-1')}>
                                <Heart size={12} />
                                <span>{collections}</span>
                            </div>
                        </div>
                    </div>
                </div>
                {rating !== undefined && (
                    <div
                        className={cn(
                            'flex items-start text-sm text-orange-400 ml-2.5'
                        )}
                    >
                        {rating ? `${rating}分` : '暂无评分'}
                    </div>
                )}
            </div>
        );
    }
);

VideoCard.displayName = 'VideoCard';

export { VideoCard, VideoCardSkeleton };
