import React, { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSearchStore } from '@/store';
import AnimeSearch from '@/pages/search/anime-search';

const useSearch = () => {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();
    const keyword = searchParams.get('keyword') || undefined;

    const loading = useSearchStore(state => state.loading);
    const list = useSearchStore(state => state.list);
    const hasMore = useSearchStore(state => state.hasMore);
    const fetchData = useSearchStore(state => state.fetchData);
    const loadMore = useSearchStore(state => state.loadMore);
    const reset = useSearchStore(state => state.reset);

    useEffect(() => {
        if (keyword) {
            fetchData(keyword);
        }

        return () => {
            reset();
        };
    }, [keyword, fetchData, reset]);

    const handleLoadMore = useCallback(() => {
        keyword && loadMore(keyword);
    }, [keyword, loadMore]);

    const handleAnimeClick = useCallback(
        (id: string) => {
            id && navigate(`/anime/${id}`);
        },
        [navigate]
    );

    return { loading, list, hasMore, handleLoadMore, handleAnimeClick };
};

interface SearchProps {}

const Search: React.FC<SearchProps> = () => {
    const { loading, list, hasMore, handleLoadMore, handleAnimeClick } =
        useSearch();

    return (
        <div
            className={cn(
                'flex flex-col gap-4 h-full md:gap-8 my-4 md:my-8',
                'transition-[margin] duration-200'
            )}
        >
            <AnimeSearch
                list={list}
                hasMore={hasMore}
                loading={loading}
                onLoadMore={handleLoadMore}
                onAnimeClick={handleAnimeClick}
            />
        </div>
    );
};

Search.displayName = 'Search';

export default Search;
