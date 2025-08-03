import { create } from 'zustand';
import type { SearchSuggestState, SearchSuggestAction } from '@/types';
import { getAnimeSuggest } from '@/apis';

const useSearchSuggestStore = create<SearchSuggestState & SearchSuggestAction>(
    set => ({
        loading: false,
        list: [],

        fetchData: async (keyword: string) => {
            set({ loading: true });
            try {
                const suggests = await getAnimeSuggest({ keyword });
                set({ list: suggests.data.rows });
            } catch (error) {
                set({ loading: false });
            }
        }
    })
);

export { useSearchSuggestStore };
