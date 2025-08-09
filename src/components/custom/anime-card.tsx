import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface AnimeCardSkeletonProps {
    type?: 'horizontal' | 'vertical';
    className?: string;
}

const AnimeCardSkeleton: React.FC<AnimeCardSkeletonProps> = memo(
    ({ type = 'vertical', className }) => {
        return (
            <div
                className={cn(
                    'w-full',
                    {
                        'max-w-[225px]': type === 'vertical',
                        'max-w-[320px]': type === 'horizontal'
                    },
                    className
                )}
            >
                <Skeleton
                    className={cn('relative rounded-sm', {
                        'aspect-[3/4]': type === 'vertical',
                        'aspect-[16/9]': type === 'horizontal'
                    })}
                />
                <Skeleton
                    className={cn(
                        'relative w-full md:w-3/4 h-5 mt-2.5 rounded-sm'
                    )}
                />
                <Skeleton
                    className={cn(
                        'relative w-3/4 md:w-1/2 h-4 mt-1.5 rounded-sm'
                    )}
                />
            </div>
        );
    }
);

AnimeCardSkeleton.displayName = 'AnimeCardSkeleton';

interface AnimeCardProps extends AnimeCardSkeletonProps {
    image: string;
    title: string;
    remark?: string;
    tip?: string;
    onClick: () => void;
}

const AnimeCard: React.FC<AnimeCardProps> = memo(
    ({ type = 'vertical', title, image, remark, tip, className, onClick }) => {
        return (
            <div
                className={cn(
                    'w-full',
                    {
                        'max-w-[225px]': type === 'vertical',
                        'max-w-[320px]': type === 'horizontal'
                    },
                    className
                )}
            >
                <div
                    className={cn(
                        'relative rounded-sm bg-cover bg-center overflow-hidden duration-200',
                        'md:hover:scale-105 md:cursor-pointer',
                        'md:transition-[scale]',
                        {
                            'aspect-[3/4]': type === 'vertical',
                            'aspect-[16/9]': type === 'horizontal'
                        }
                    )}
                    style={{
                        backgroundImage: `url("${image}")`
                    }}
                    onClick={onClick}
                >
                    {tip && (
                        <div
                            className={cn(
                                'absolute z-2 text-white right-2 bottom-1 text-xs'
                            )}
                        >
                            {tip}
                        </div>
                    )}
                    <div
                        className={cn(
                            'absolute -bottom-0.5 z-1 w-full h-10 bg-card-cover'
                        )}
                    ></div>
                </div>
                <div
                    className={cn(
                        'w-fit line-clamp-1 text-sm mt-2.5 hover:text-primary cursor-pointer',
                        'transition-[color] duration-200'
                    )}
                    title={title}
                    onClick={onClick}
                >
                    {title}
                </div>
                {remark && (
                    <div
                        className={cn(
                            'w-fit line-clamp-1 text-xs mt-1.5 text-muted-foreground hover:text-primary cursor-pointer',
                            'transition-[color] duration-200'
                        )}
                        title={remark}
                        onClick={onClick}
                    >
                        {remark}
                    </div>
                )}
            </div>
        );
    }
);

AnimeCard.displayName = 'AnimeCard';

export { AnimeCard, AnimeCardSkeleton };
