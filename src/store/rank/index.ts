import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { RankState, RankAction } from '@/types';
import { getAnimeHotRank } from '@/apis';

const DEFAULT_PAGE_SIZE = 25;
const LOADING_DELAY = import.meta.env.VITE_LOADING_DELAY;

const useRankStore = create<RankState & RankAction>()(
    devtools((set, get) => ({
        loading: false,
        list: [],
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
        hasMore: true,

        fetchData: async () => {
            const { pageSize } = get();

            try {
                set({ loading: true });

                const response = await getAnimeHotRank({
                    page: 1,
                    pageSize
                });

                const { rows = [], total = 0 } = response.data;
                const hasMore = rows.length < total;
                set({
                    list: rows,
                    total: total,
                    loading: false,
                    hasMore
                });
            } catch (error) {
                set({ loading: false });
            }
        },

        loadMore: async () => {
            const { list, loading, page, pageSize, hasMore } = get();

            // 检查是否可以加载更多
            if (loading || !hasMore) return;

            let loadingTimer: NodeJS.Timeout | null = null;

            try {
                // 延迟显示加载状态
                loadingTimer = setTimeout(() => {
                    set({ loading: true });
                }, LOADING_DELAY);

                const nextPage = page + 1;

                const response = await getAnimeHotRank({
                    page: nextPage,
                    pageSize
                });

                // 清除定时器
                if (loadingTimer) clearTimeout(loadingTimer);

                const { rows = [], total = 0 } = response.data;
                const newList = [...list, ...rows];
                const newHasMore = newList.length < total;

                set({
                    list: newList,
                    page: nextPage,
                    total,
                    loading: false,
                    hasMore: newHasMore
                });
            } catch (error) {
                // 清除定时器
                if (loadingTimer) clearTimeout(loadingTimer);

                set({ loading: false });
            }
        },

        reset: () => {
            set({
                loading: false,
                list: [],
                page: 1,
                pageSize: DEFAULT_PAGE_SIZE,
                total: 0,
                hasMore: true
            });
        }
    }))
);

export { useRankStore };
