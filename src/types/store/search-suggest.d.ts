import type { AnimeSuggestItem } from '@/types';

interface SearchSuggestState {
    loading: boolean;
    list: AnimeSuggestItem[];
}

interface SearchSuggestAction {
    fetchData: (keyword: string) => Promise<void>;
}

export { SearchSuggestState, SearchSuggestAction };
