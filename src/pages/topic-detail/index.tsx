import React, { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useTopicDetailStore } from '@/store';
import AnimeRank from '@/pages/rank/anime-rank';

const useTopicDetail = () => {
    const navigate = useNavigate();

    const detail = useTopicDetailStore(state => state.detail!);
    const loading = useTopicDetailStore(state => state.loading);
    const list = useTopicDetailStore(state => state.list);
    const hasMore = useTopicDetailStore(state => state.hasMore);
    const fetchData = useTopicDetailStore(state => state.fetchData);
    const loadMore = useTopicDetailStore(state => state.loadMore);
    const reset = useTopicDetailStore(state => state.reset);

    useEffect(() => {
        fetchData(detail.id);

        return () => {
            reset();
        };
    }, [detail.id, fetchData, reset]);

    const handleLoadMore = useCallback(() => {
        loadMore(detail.id);
    }, [detail.id, loadMore]);

    const handleAnimeClick = useCallback(
        (id: string) => {
            id && navigate(`/anime/${id}`);
        },
        [navigate]
    );

    return {
        detail,
        loading,
        list,
        hasMore,
        handleLoadMore,
        handleAnimeClick
    };
};

const TopicDetail: React.FC = () => {
    const { detail, loading, list, hasMore, handleLoadMore, handleAnimeClick } =
        useTopicDetail();

    return (
        <div
            className={cn(
                'flex flex-col gap-4 h-full md:gap-8 my-4 md:my-8',
                'transition-[margin] duration-200'
            )}
        >
            <AnimeRank
                title={detail.name}
                description={detail.description}
                loading={loading}
                list={list}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                onAnimeClick={handleAnimeClick}
            />
        </div>
    );
};

TopicDetail.displayName = 'TopicDetail';

export default TopicDetail;
