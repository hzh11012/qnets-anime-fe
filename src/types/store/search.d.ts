import type { AnimeSearchItem } from '@/types';

interface SearchState {
    loading: boolean;
    list: AnimeSearchItem[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
}

interface SearchAction {
    fetchData: (keyword: string) => Promise<void>;
    loadMore: (keyword: string) => Promise<void>;
    reset: () => void;
}

export { SearchState, SearchAction };
