import React, { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useTopicStore } from '@/store';
import AnimeTopic from '@/pages/topic/anime-topic';

const useTopic = () => {
    const navigate = useNavigate();

    const loading = useTopicStore(state => state.loading);
    const list = useTopicStore(state => state.list);
    const hasMore = useTopicStore(state => state.hasMore);
    const fetchData = useTopicStore(state => state.fetchData);
    const loadMore = useTopicStore(state => state.loadMore);
    const reset = useTopicStore(state => state.reset);

    useEffect(() => {
        fetchData();

        return () => {
            reset();
        };
    }, [fetchData, reset]);

    const handleLoadMore = useCallback(() => {
        loadMore();
    }, [loadMore]);

    const handleTopicClick = useCallback(
        (id: string) => {
            id && navigate(`/topic/${id}`);
        },
        [navigate]
    );

    return {
        loading,
        list,
        hasMore,
        handleLoadMore,
        handleTopicClick
    };
};

const Topic: React.FC = () => {
    const { loading, list, hasMore, handleLoadMore, handleTopicClick } =
        useTopic();

    return (
        <div
            className={cn(
                'flex flex-col gap-4 h-full md:gap-8 my-4 md:my-8',
                'transition-[margin] duration-200'
            )}
        >
            <AnimeTopic
                title="专题推荐"
                loading={loading}
                list={list}
                hasMore={hasMore}
                onLoadMore={handleLoadMore}
                onTopicClick={handleTopicClick}
            />
        </div>
    );
};

Topic.displayName = 'Topic';

export default Topic;
