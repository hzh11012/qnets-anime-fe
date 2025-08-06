import React, { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useGuideStore } from '@/store';
import AnimeGuide from '@/pages/guide/anime-guide';

const useGuide = () => {
    const navigate = useNavigate();

    const loading = useGuideStore(state => state.loading);
    const list = useGuideStore(state => state.list);
    const hasMore = useGuideStore(state => state.hasMore);
    const updateDay = useGuideStore(state => state.updateDay);
    const fetchData = useGuideStore(state => state.fetchData);
    const loadMore = useGuideStore(state => state.loadMore);
    const reset = useGuideStore(state => state.reset);
    const toggleDay = useGuideStore(state => state.toggleDay);

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
        updateDay,
        handleLoadMore,
        handleAnimeClick,
        toggleDay
    };
};

const Guide: React.FC = () => {
    const {
        loading,
        list,
        hasMore,
        updateDay,
        handleLoadMore,
        handleAnimeClick,
        toggleDay
    } = useGuide();

    return (
        <div
            className={cn(
                'flex flex-col gap-4 h-full md:gap-8 my-4 md:my-8',
                'transition-[margin] duration-200'
            )}
        >
            <AnimeGuide
                title="新番导视"
                defaultDay={updateDay}
                loading={loading}
                list={list}
                hasMore={hasMore}
                onDayChage={toggleDay}
                onLoadMore={handleLoadMore}
                onAnimeClick={handleAnimeClick}
            />
        </div>
    );
};

Guide.displayName = 'Guide';

export default Guide;
