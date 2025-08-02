import React, { useCallback, useMemo } from 'react';
import { AnimeCard, AnimeCardSkeleton } from '@/components/custom/anime-card';
import { cn } from '@/lib/utils';
import type { AnimeYouLike } from '@/types';
import { useInView } from 'react-intersection-observer';

interface AnimeGuessProps {
    title: string;
    list: AnimeYouLike[];
    total: number;
    loading: boolean;
    onLoadMore: () => void;
    onAnimeClick: (id: string) => void;
    className?: string;
}

const AnimeGuessSkeleton: React.FC<{ count?: number }> = ({ count = 10 }) => (
    <>
        {[...Array(count)].map((_, index) => (
            <AnimeCardSkeleton type="horizontal" key={index} />
        ))}
    </>
);

const AnimeGuess: React.FC<AnimeGuessProps> = ({
    title,
    list,
    total,
    className,
    loading,
    onLoadMore,
    onAnimeClick
}) => {
    const hasMore = useMemo(() => {
        return list.length < total;
    }, [list, total]);

    const { ref } = useInView({
        threshold: 0,
        onChange: inView => {
            if (inView && !loading && hasMore) {
                onLoadMore();
            }
        }
    });

    const handleAnimeClick = (id: string) => onAnimeClick(id);

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

    if (!list.length && !loading) return null;

    return (
        <div
            className={cn(
                'select-none transition-[margin] duration-200',
                className
            )}
        >
            <div className={cn('flex items-center mb-4')}>
                <div className={cn('font-bold text-base leading-9')}>{title}</div>
            </div>
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
                    const { id, videoId = '', name, remark, bannerUrl } = item;
                    const tip = getSubTitle(item);

                    return (
                        <AnimeCard
                            key={id}
                            type="horizontal"
                            title={name}
                            remark={remark}
                            tip={tip}
                            image={bannerUrl}
                            onClick={() => handleAnimeClick(videoId)}
                        />
                    );
                })}
                {loading && <AnimeGuessSkeleton />}
                {/* 触底加载的锚点 */}
                <div ref={hasMore ? ref : undefined} style={{ height: 0 }} />
            </div>
        </div>
    );
};

export default AnimeGuess;
