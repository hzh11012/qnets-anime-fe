import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { GuideState, GuideAction } from '@/types';
import { getAnimeGuideList } from '@/apis';

const DEFAULT_PAGE_SIZE = 10;
const LOADING_DELAY = import.meta.env.VITE_LOADING_DELAY;

const useGuideStore = create<GuideState & GuideAction>()(
    devtools((set, get) => ({
        loading: false,
        list: [],
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
        updateDay: new Date().getDay().toString(),
        hasMore: true,

        fetchData: async () => {
            const { pageSize, updateDay } = get();

            try {
                set({ loading: true });

                const response = await getAnimeGuideList({
                    updateDay,
                    page: 1,
                    pageSize: pageSize * 2
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
            const { list, loading, page, pageSize, updateDay, hasMore } = get();

            // 检查是否可以加载更多
            if (loading || !hasMore) return;

            let loadingTimer: NodeJS.Timeout | null = null;

            try {
                // 延迟显示加载状态
                loadingTimer = setTimeout(() => {
                    set({ loading: true });
                }, LOADING_DELAY);

                const nextPage = page + 1;

                const response = await getAnimeGuideList({
                    updateDay,
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

        toggleDay: async (updateDay: string) => {
            set({
                loading: false,
                list: [],
                page: 1,
                pageSize: DEFAULT_PAGE_SIZE,
                total: 0,
                hasMore: true,
                updateDay
            });

            const { pageSize } = get();

            let loadingTimer: NodeJS.Timeout | null = null;

            try {
                // 延迟显示加载状态
                loadingTimer = setTimeout(() => {
                    set({ loading: true });
                }, LOADING_DELAY);

                const response = await getAnimeGuideList({
                    updateDay,
                    page: 1,
                    pageSize: pageSize * 2
                });

                // 清除定时器
                if (loadingTimer) clearTimeout(loadingTimer);

                const { rows = [], total = 0 } = response.data;
                const hasMore = rows.length < total;
                set({
                    list: rows,
                    total: total,
                    loading: false,
                    hasMore
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
                hasMore: true,
                updateDay: new Date().getDay().toString()
            });
        }
    }))
);

export { useGuideStore };
