import React, { memo, useContext, useEffect, useMemo, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { ContainerContext } from '@/pages/search/anime-provider';

const ANIME_TYPES_MAP: Record<number, string> = {
    0: '剧场版',
    1: '日番',
    2: '美漫',
    3: '国创',
    4: '里番'
} as const;

const YEARS_MAP: Record<number, string> = {
    0: '1月',
    1: '4月',
    2: '7月',
    3: '10月'
} as const;

interface VideoEpisodeProps {
    list: { id: string; episode: number }[];
    onAnimeClick: (id: string) => void;
}

const VideoEpisode: React.FC<VideoEpisodeProps> = ({ list, onAnimeClick }) => {
    const listRef = useRef<HTMLDivElement>(null);
    const { width: containerWidth, setObserverRef } =
        useContext(ContainerContext);

    useEffect(() => {
        const element = listRef.current;
        if (element) {
            setObserverRef(element);
        }

        return () => {
            setObserverRef(null);
        };
    }, [setObserverRef]);

    // 使用 useMemo 计算显示的剧集列表
    const episodes = useMemo(() => {
        if (!containerWidth || list.length === 0) return list;

        const ITEM_WIDTH = 40; // 按钮宽度 + 间距
        const count = Math.floor((containerWidth + 8) / ITEM_WIDTH);

        if (list.length <= count) return list;

        if (count < 3) return [];

        return [
            ...list.slice(0, count - 2),
            {
                id: 'ellipsis',
                episode: '...' as const
            },
            ...list.slice(-1)
        ];
    }, [list, containerWidth]);

    return (
        <div
            ref={listRef}
            className={cn(
                'flex items-center flex-1 w-0  overflow-hidden gap-2'
            )}
        >
            {episodes.map(item => {
                const { id, episode } = item;
                return (
                    <Button
                        key={id}
                        variant="outline"
                        className={cn('size-8 px-3.5')}
                        disabled={id === 'ellipsis'}
                        onClick={() => onAnimeClick(id)}
                    >
                        {episode}
                    </Button>
                );
            })}
        </div>
    );
};

VideoEpisode.displayName = 'VideoEpisode';

interface AnimeSearchCardSkeletonProps {
    className?: string;
}

const AnimeSearchCardSkeleton: React.FC<AnimeSearchCardSkeletonProps> = memo(
    ({ className }) => {
        return (
            <div className={cn('w-full flex gap-2 md:gap-4', className)}>
                <Skeleton
                    className={cn(
                        'relative rounded-sm aspect-[3/4] shrink-0 w-37 2xl:w-48',
                        'transition-[width] duration-200'
                    )}
                />
                <div className={cn('flex-1 flex flex-col justify-between')}>
                    <div className={cn('flex flex-col gap-2')}>
                        <Skeleton
                            className={cn('w-full md:w-3/4 h-5 rounded-sm')}
                        />
                        <Skeleton
                            className={cn('w-3/4 md:w-1/2 h-3.5 rounded-sm')}
                        />
                        <Skeleton
                            className={cn('w-full md:w-4/7 h-3.5 rounded-sm')}
                        />
                    </div>
                    <div className={cn('flex flex-col gap-2')}>
                        <Skeleton className={cn('w-1/6 h-4 rounded-sm')} />
                        <Skeleton
                            className={cn('w-3/4 md:w-1/2 h-8 rounded-sm')}
                        />
                    </div>
                </div>
            </div>
        );
    }
);

AnimeSearchCardSkeleton.displayName = 'AnimeSearchCardSkeleton';

interface AnimeSearchCardProps extends AnimeSearchCardSkeletonProps {
    videoId?: string;
    title: string;
    image: string;
    tags: string[];
    year: number;
    month: number;
    type: number;
    statusText: string;
    playText: string;
    director: string;
    cv: string;
    description: string;
    ratingCount: number;
    averageRating: number;
    videos: { id: string; episode: number }[];
    onAnimeClick: (id: string) => void;
}

const AnimeSearchCard: React.FC<AnimeSearchCardProps> = memo(
    ({
        videoId = '',
        image,
        title,
        type,
        tags,
        year,
        month,
        statusText,
        playText,
        director,
        cv,
        description,
        ratingCount,
        averageRating,
        videos,
        className,
        onAnimeClick
    }) => {
        return (
            <div className={cn('w-full flex gap-2 md:gap-4', className)}>
                <div
                    className={cn(
                        'relative rounded-sm bg-cover bg-center shrink-0 aspect-[3/4] overflow-hidden',
                        'md:cursor-pointer w-37 2xl:w-48',
                        'transition-[width] duration-200'
                    )}
                    style={{
                        backgroundImage: `url("${image}")`
                    }}
                    onClick={() => onAnimeClick(videoId)}
                >
                    <div
                        className={cn(
                            'absolute top-3 right-0 text-white text-xs bg-primary pl-2 pr-1.5 py-0.5 rounded-l-lg '
                        )}
                    >
                        {ANIME_TYPES_MAP[type]}
                    </div>
                </div>
                <div className={cn('flex-1 flex flex-col justify-between')}>
                    <div
                        className={cn(
                            'flex flex-col text-xs tracking-wide gap-1'
                        )}
                    >
                        <div
                            className={cn(
                                'text-base text-foreground line-clamp-1 md:cursor-pointer',
                                'hover:text-primary',
                                'transition-[color] duration-200'
                            )}
                            title={title}
                            onClick={() => onAnimeClick(videoId)}
                        >
                            {title}
                        </div>
                        <div
                            className={cn('text-card-foreground line-clamp-1 ')}
                            title={`${tags.join('/')} · ${year} · ${YEARS_MAP[month]} · ${statusText}`}
                        >
                            {tags.join('/')} · {year} · {YEARS_MAP[month]} ·{' '}
                            {statusText}
                        </div>
                        <div
                            className={cn('text-card-foreground line-clamp-1 ')}
                            title={`导演：${director}；声优：${cv}`}
                        >
                            导演：{director}；声优：{cv}
                        </div>
                        <div
                            className={cn('text-muted-foreground line-clamp-3')}
                            title={description}
                        >
                            简介：{description}
                        </div>
                    </div>
                    <div
                        className={cn(
                            'flex flex-col text-xs tracking-wide gap-2'
                        )}
                    >
                        {!!ratingCount && (
                            <div className={cn('flex items-end')}>
                                <span
                                    className={cn('mr-2 text-card-foreground')}
                                >
                                    {ratingCount}人评分
                                </span>
                                <span
                                    className={cn(
                                        'text-orange-400 text-xl leading-none font-bold'
                                    )}
                                >
                                    {averageRating}
                                </span>
                                <span
                                    className={cn('text-orange-400 font-bold')}
                                >
                                    分
                                </span>
                            </div>
                        )}
                        <div className={cn('flex gap-2')}>
                            <Button
                                variant="default"
                                className={cn('w-22 h-8')}
                                onClick={() => onAnimeClick(videoId)}
                            >
                                {playText}
                            </Button>
                            <VideoEpisode
                                list={videos}
                                onAnimeClick={onAnimeClick}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
);

AnimeSearchCard.displayName = 'AnimeSearchCard';

export { AnimeSearchCard, AnimeSearchCardSkeleton };
