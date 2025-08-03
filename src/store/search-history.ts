import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { SearchHistoryState, SearchHistoryAction } from '@/types';

const useSearchHistoryStore = create(
    persist<SearchHistoryState & SearchHistoryAction>(
        set => ({
            histories: [],

            createHistory: (keyword: string) => {
                set(state => {
                    // 移除重复项并保留最新记录
                    const filtered = state.histories.filter(t => t !== keyword);
                    return { histories: [keyword, ...filtered].slice(0, 10) };
                });
            },
            removeHistory: (keyword: string) => {
                set(state => ({
                    histories: state.histories.filter(t => t !== keyword)
                }));
            },
            clearHistory: () => set({ histories: [] })
        }),
        {
            name: 'search-history-store',
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export { useSearchHistoryStore };
