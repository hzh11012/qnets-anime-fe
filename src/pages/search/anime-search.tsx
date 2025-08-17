import React, { useCallback, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { AnimeSearchItem } from '@/types';
import { useInView } from 'react-intersection-observer';
import Exception from '@/components/custom/exception';
import { AnimeSearchCard } from '@/pages/search/aniem-search-card';
import { ContainerProvider } from '@/pages/search/anime-provider';
import AnimeSearchSkeleton from '@/pages/search/anime-search-skeleton';

interface AnimeSearchListProps {
    list: AnimeSearchItem[];
    loading: boolean;
    getPlayText: (item: AnimeSearchItem) => string;
    getStatusText: (item: AnimeSearchItem) => string;
    onAnimeClick: (id: string) => void;
}

const AnimeSearchList: React.FC<AnimeSearchListProps> = ({
    list,
    loading,
    getPlayText,
    getStatusText,
    onAnimeClick
}) => {
    return (
        <ContainerProvider>
            <div
                className={cn(
                    'grid gap-4 grid-cols-2 text-sm',
                    'md:gap-6',
                    'max-[1100px]:grid-cols-1'
                )}
            >
                {list.map(item => {
                    const {
                        id,
                        name,
                        highlightName,
                        type,
                        coverUrl,
                        tags,
                        year,
                        month,
                        director,
                        cv,
                        ratingCount,
                        averageRating,
                        description,
                        videos,
                        videoId
                    } = item;
                    const playText = getPlayText(item);
                    const statusText = getStatusText(item);

                    return (
                        <AnimeSearchCard
                            key={id}
                            videoId={videoId}
                            image={coverUrl}
                            title={name}
                            highlightTitle={highlightName}
                            type={type}
                            tags={tags}
                            year={year}
                            month={month}
                            statusText={statusText}
                            playText={playText}
                            director={director}
                            cv={cv}
                            description={description}
                            ratingCount={ratingCount}
                            averageRating={averageRating}
                            videos={videos}
                            onAnimeClick={onAnimeClick}
                        />
                    );
                })}
                {loading && <AnimeSearchSkeleton />}
            </div>
        </ContainerProvider>
    );
};

AnimeSearchList.displayName = 'AnimeSearchList';

interface AnimeSearchProps {
    list: AnimeSearchItem[];
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    onAnimeClick: (id: string) => void;
    className?: string;
}

const AnimeSearch: React.FC<AnimeSearchProps> = ({
    list,
    hasMore,
    className,
    loading,
    onLoadMore,
    onAnimeClick
}) => {
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

    const getStatusText = useCallback((item: AnimeSearchItem) => {
        const { videoCount, status } = item;

        if (!videoCount) return '即将开播';

        if (status === 1) {
            return `更新至第${videoCount}话`;
        } else if (status === 2) {
            return `全${videoCount}话`;
        }

        return '即将开播';
    }, []);

    const getPlayText = useCallback((item: AnimeSearchItem) => {
        const { videoCount, status } = item;

        if (!videoCount || status === 0) return '即将开播';

        return '立即观看';
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
            {isEmpty ? (
                <Exception type="empty" />
            ) : (
                <>
                    <AnimeSearchList
                        list={list}
                        loading={loading}
                        getPlayText={getPlayText}
                        getStatusText={getStatusText}
                        onAnimeClick={handleAnimeClick}
                    />
                    {/* 触底加载的锚点 */}
                    <div
                        ref={hasMore ? ref : undefined}
                        style={{ height: 0 }}
                    />
                </>
            )}
        </div>
    );
};

AnimeSearch.displayName = 'AnimeSearch';

export default AnimeSearch;
