import React, { memo, useCallback, useMemo } from 'react';
import { AnimeCard } from '@/components/custom/anime-card';
import { cn } from '@/lib/utils';
import type { AnimeHotRank } from '@/types';
import { useInView } from 'react-intersection-observer';
import Exception from '@/components/custom/exception';
import AnimeSkeleton from '@/components/custom/anime-skeleton';

interface AnimeRankHeaderProps {
    title: string;
    description?: string;
}

const AnimeRankHeader: React.FC<AnimeRankHeaderProps> = memo(
    ({ title, description }) => {
        return (
            <div className={cn('flex flex-col justify-center mb-4')}>
                <div className={cn('font-bold text-base leading-9')}>
                    {title}
                </div>
                {description && (
                    <div className={cn('text-muted-foreground text-sm')}>
                        简介：{description}
                    </div>
                )}
            </div>
        );
    }
);

AnimeRankHeader.displayName = 'AnimeRankHeader';

interface AnimeRankListProps {
    ref: (node?: Element | null) => void;
    list: AnimeHotRank[];
    loading: boolean;
    hasMore: boolean;
    getSubTitle: (item: AnimeHotRank) => string;
    onAnimeClick: (id: string) => void;
}

const AnimeRankList: React.FC<AnimeRankListProps> = ({
    ref,
    list,
    loading,
    hasMore,
    getSubTitle,
    onAnimeClick
}) => {
    return (
        <div
            className={cn(
                'grid gap-4 grid-cols-7 text-sm',
                'md:gap-6',
                'max-[1500px]:grid-cols-6',
                'max-[1300px]:grid-cols-5',
                'max-[1100px]:grid-cols-4',
                'max-[855px]:grid-cols-3',
                'max-md:grid-cols-3'
            )}
        >
            {list.map(item => {
                const { id, name, remark, coverUrl, videoId = '' } = item;
                const tip = getSubTitle(item);

                return (
                    <AnimeCard
                        key={id}
                        type="vertical"
                        title={name}
                        remark={remark}
                        tip={tip}
                        image={coverUrl}
                        onClick={() => onAnimeClick(videoId)}
                    />
                );
            })}
            {loading && <AnimeSkeleton />}
            {/* 触底加载的锚点 */}
            {hasMore && <div ref={ref} style={{ height: 0 }} />}
        </div>
    );
};

AnimeRankList.displayName = 'AnimeRankList';

interface AnimeRankProps extends AnimeRankHeaderProps {
    list: AnimeHotRank[];
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    onAnimeClick: (id: string) => void;
    className?: string;
}

const AnimeRank: React.FC<AnimeRankProps> = ({
    title,
    description,
    list,
    hasMore,
    className,
    loading,
    onLoadMore,
    onAnimeClick
}) => {
    const { ref } = useInView({
        threshold: 0,
        onChange: inView => {
            if (inView && !loading && hasMore) {
                onLoadMore();
            }
        }
    });

    const handleAnimeClick = useCallback(
        (id: string) => {
            id && onAnimeClick(id);
        },
        [onAnimeClick]
    );

    const getSubTitle = useCallback((item: AnimeHotRank) => {
        const { videoCount, status } = item;

        if (!videoCount) return '即将开播';

        if (status === 1) {
            return `更新至第${videoCount}话`;
        } else if (status === 2) {
            return `全${videoCount}话`;
        }

        return '即将开播';
    }, []);

    const isEmpty = useMemo(
        () => !list.length && !loading,
        [list.length, loading]
    );

    return (
        <div
            className={cn(
                'size-full select-none transition-[margin] duration-200',
                className
            )}
        >
            <AnimeRankHeader title={title} description={description} />
            {isEmpty ? (
                <Exception type="empty" />
            ) : (
                <AnimeRankList
                    ref={ref}
                    list={list}
                    loading={loading}
                    hasMore={hasMore}
                    getSubTitle={getSubTitle}
                    onAnimeClick={handleAnimeClick}
                />
            )}
        </div>
    );
};

AnimeRank.displayName = 'AnimeRank';

export default AnimeRank;
