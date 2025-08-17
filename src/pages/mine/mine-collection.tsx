import React, { useCallback, useEffect, useMemo } from 'react';
import { AnimeCard } from '@/components/custom/anime-card';
import { cn } from '@/lib/utils';
import type { CollectionItem } from '@/types';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { useMineStore } from '@/store';
import Exception from '@/components/custom/exception';
import AnimeSkeleton from '@/components/custom/anime-skeleton';

interface CollectionListProps {
    list: CollectionItem[];
    loading: boolean;
    getSubTitle: (item: CollectionItem) => string;
    onAnimeClick: (id: string) => void;
}

const CollectionList: React.FC<CollectionListProps> = ({
    list,
    loading,
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
        </div>
    );
};

CollectionList.displayName = 'CollectionList';

interface CollectionProps {
    list: CollectionItem[];
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    onAnimeClick: (id: string) => void;
}

const Collection: React.FC<CollectionProps> = ({
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

    const getSubTitle = useCallback((item: CollectionItem) => {
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
        <>
            {isEmpty ? (
                <Exception type="empty" />
            ) : (
                <>
                    <CollectionList
                        list={list}
                        loading={loading}
                        getSubTitle={getSubTitle}
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

Collection.displayName = 'Collection';

interface MineCollectionProsp {
    className?: string;
}

const useCollection = () => {
    const navigate = useNavigate();

    const loading = useMineStore(state => state.collection.loading);
    const list = useMineStore(state => state.collection.list);
    const hasMore = useMineStore(state => state.collection.hasMore);
    const fetchData = useMineStore(state => state.collection.fetchData);
    const loadMore = useMineStore(state => state.collection.loadMore);
    const reset = useMineStore(state => state.collection.reset);

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

const MineCollection: React.FC<MineCollectionProsp> = () => {
    const { loading, list, hasMore, handleLoadMore, handleAnimeClick } =
        useCollection();

    return (
        <Collection
            loading={loading}
            list={list}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            onAnimeClick={handleAnimeClick}
        />
    );
};

MineCollection.displayName = 'MineCollection';

export default MineCollection;
