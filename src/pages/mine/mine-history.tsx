import React, { useCallback, useEffect, useMemo } from 'react';
import { AnimeCard } from '@/components/custom/anime-card';
import { cn, formatDate, formatVideoTime } from '@/lib/utils';
import type { VideoHistoryItem } from '@/types';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useMineStore } from '@/store';
import Exception from '@/components/custom/exception';
import AnimeSkeleton from '@/components/custom/anime-skeleton';

interface HistoryListProps {
    list: VideoHistoryItem[];
    loading: boolean;
    onAnimeClick: (id: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({
    list,
    loading,
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
                const { id, name, time, bannerUrl, video, updatedAt, videoId } =
                    item;
                const remark = `第${video.episode}话 ${video.title}`;
                const _time = formatVideoTime(time);
                const _updatedAt = formatDate(updatedAt);

                return (
                    <AnimeCard
                        key={id}
                        type="horizontal"
                        title={name}
                        remark={remark}
                        time={_updatedAt}
                        tip={_time}
                        image={bannerUrl}
                        onClick={() => onAnimeClick(videoId)}
                    />
                );
            })}
            {loading && <AnimeSkeleton type="horizontal" />}
        </div>
    );
};

interface HistoryProps {
    list: VideoHistoryItem[];
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    onAnimeClick: (id: string) => void;
}

HistoryList.displayName = 'HistoryList';

const History: React.FC<HistoryProps> = ({
    list,
    hasMore,
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

    const isEmpty = useMemo(
        () => !list.length && !loading,
        [list.length, loading]
    );

    return (
        <>
            {isEmpty ? (
                <Exception type="empty" />
            ) : (
                <>
                    <HistoryList
                        list={list}
                        loading={loading}
                        onAnimeClick={handleAnimeClick}
                    />
                    {/* 触底加载的锚点 */}
                    <div
                        ref={hasMore ? ref : undefined}
                        style={{ height: 0 }}
                    />
                </>
            )}
        </>
    );
};

History.displayName = 'History';

interface MineHistoryProsp {
    className?: string;
}

const useHistory = () => {
    const navigate = useNavigate();

    const loading = useMineStore(state => state.history.loading);
    const list = useMineStore(state => state.history.list);
    const hasMore = useMineStore(state => state.history.hasMore);
    const fetchData = useMineStore(state => state.history.fetchData);
    const loadMore = useMineStore(state => state.history.loadMore);
    const reset = useMineStore(state => state.history.reset);

    useEffect(() => {
        fetchData();

        return () => {
            reset();
        };
    }, [fetchData, reset]);

    const handleLoadMore = useCallback(() => {
        loadMore();
    }, [loadMore]);

    const handleAnimeClick = useCallback(
        (id: string) => {
            id && navigate(`/anime/${id}`);
        },
        [navigate]
    );

    return {
        loading,
        list,
        hasMore,
        handleLoadMore,
        handleAnimeClick
    };
};

const MineHistory: React.FC<MineHistoryProsp> = () => {
    const { loading, list, hasMore, handleLoadMore, handleAnimeClick } =
        useHistory();

    return (
        <History
            loading={loading}
            list={list}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onAnimeClick={handleAnimeClick}
        />
    );
};

MineHistory.displayName = 'MineHistory';

export default MineHistory;
