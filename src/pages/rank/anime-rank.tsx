import React, { useCallback, useMemo } from 'react';
import { AnimeCard, AnimeCardSkeleton } from '@/components/custom/anime-card';
import { cn } from '@/lib/utils';
import type { AnimeHotRank } from '@/types';
import { useInView } from 'react-intersection-observer';
import Exception from '@/components/custom/exception';

interface AnimeRankProps {
    title: string;
    list: AnimeHotRank[];
    total: number;
    loading: boolean;
    onLoadMore: () => void;
    onAnimeClick: (id: string) => void;
    className?: string;
}

const AnimeRankSkeleton: React.FC<{ count?: number }> = ({ count = 10 }) => (
    <>
        {[...Array(count)].map((_, index) => (
            <AnimeCardSkeleton type="vertical" key={index} />
        ))}
    </>
);

const AnimeRank: React.FC<AnimeRankProps> = ({
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

    return (
        <div
            className={cn(
                'size-full select-none transition-[margin] duration-200',
                className
            )}
        >
            <div className={cn('flex items-center mb-4')}>
                <div className={cn('font-bold text-base leading-9')}>{title}</div>
            </div>
            {!list.length && !loading ? (
                <Exception type="empty" />
            ) : (
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
                        const {
                            id,
                            name,
                            remark,
                            coverUrl,
                            videoId = ''
                        } = item;
                        const tip = getSubTitle(item);

                        return (
                            <AnimeCard
                                key={id}
                                type="vertical"
                                title={name}
                                remark={remark}
                                tip={tip}
                                image={coverUrl}
                                onClick={() => handleAnimeClick(videoId)}
                            />
                        );
                    })}
                    {loading && <AnimeRankSkeleton />}
                    {/* 触底加载的锚点 */}
                    <div
                        ref={hasMore ? ref : undefined}
                        style={{ height: 0 }}
                    />
                </div>
            )}
        </div>
    );
};

export default AnimeRank;
