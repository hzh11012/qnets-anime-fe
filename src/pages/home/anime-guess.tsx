import React, { memo, useCallback, useMemo } from 'react';
import { AnimeCard } from '@/components/custom/anime-card';
import { cn } from '@/lib/utils';
import type { AnimeYouLike } from '@/types';
import { useInView } from 'react-intersection-observer';
import AnimeSkeleton from '@/components/custom/anime-skeleton';

interface AnimeGuessHeaderProps {
    title: string;
}

const AnimeGuessHeader: React.FC<AnimeGuessHeaderProps> = memo(({ title }) => {
    return (
        <div className={cn('flex items-center mb-4')}>
            <div className={cn('font-bold text-base leading-9')}>{title}</div>
        </div>
    );
});

AnimeGuessHeader.displayName = 'AnimeGuessHeader';

interface AnimeGuessListProps {
    list: AnimeYouLike[];
    loading: boolean;
    getSubTitle: (item: AnimeYouLike) => string;
    onAnimeClick: (id: string) => void;
}

const AnimeGuessList: React.FC<AnimeGuessListProps> = ({
    list,
    loading,
    getSubTitle,
    onAnimeClick
}) => {
    return (
        <div
            className={cn(
                'grid gap-4 grid-cols-5 text-sm',
                'md:gap-6',
                'max-[1500px]:grid-cols-4',
                'max-[1140px]:grid-cols-3',
                'max-[855px]:grid-cols-2',
                'max-md:grid-cols-2'
            )}
        >
            {list.map(item => {
                const { id, name, remark, bannerUrl, videoId = '' } = item;
                const tip = getSubTitle(item);

                return (
                    <AnimeCard
                        key={id}
                        type="horizontal"
                        title={name}
                        remark={remark}
                        tip={tip}
                        image={bannerUrl}
                        onClick={() => onAnimeClick(videoId)}
                    />
                );
            })}
            {loading && <AnimeSkeleton type="horizontal" />}
        </div>
    );
};

AnimeGuessList.displayName = 'AnimeGuessList';

interface AnimeGuessProps extends AnimeGuessHeaderProps {
    list: AnimeYouLike[];
    hasMore: boolean;
    loading: boolean;
    onLoadMore: () => void;
    onAnimeClick: (id: string) => void;
    className?: string;
}

const AnimeGuess: React.FC<AnimeGuessProps> = ({
    title,
    list,
    hasMore,
    className,
    loading,
    onLoadMore,
    onAnimeClick
}) => {
    const isEmpty = useMemo(
        () => !list.length && !loading,
        [list.length, loading]
    );

    const { ref } = useInView({
        threshold: 0,
        skip: loading || !hasMore,
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

    const getSubTitle = useCallback((item: AnimeYouLike) => {
        const { videoCount, status } = item;

        if (!videoCount) return '即将开播';

        if (status === 1) {
            return `更新至第${videoCount}话`;
        } else if (status === 2) {
            return `全${videoCount}话`;
        }

        return '即将开播';
    }, []);

    if (isEmpty) return null;

    return (
        <div
            className={cn(
                'select-none transition-[margin] duration-200',
                className
            )}
        >
            <AnimeGuessHeader title={title} />
            <AnimeGuessList
                list={list}
                loading={loading}
                getSubTitle={getSubTitle}
                onAnimeClick={handleAnimeClick}
            />
            {/* 触底加载的锚点 */}
            <div ref={hasMore ? ref : undefined} style={{ height: 0 }} />
        </div>
    );
};

AnimeGuess.displayName = 'AnimeGuess';

export default AnimeGuess;
