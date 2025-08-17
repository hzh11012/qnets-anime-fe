import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { BangumiState, BangumiAction } from '@/types';
import { getAnimeTag, getAnimeBangumi } from '@/apis';

const DEFAULT_PAGE_SIZE = 25;
const LOADING_DELAY = import.meta.env.VITE_LOADING_DELAY;

const useBangumiStore = create<BangumiState & BangumiAction>()(
    devtools((set, get) => ({
        tags: [],
        loading: false,
        list: [],
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
        hasMore: true,

        fetchTagData: async () => {
            try {
                const tags = await getAnimeTag();
                set({ tags: tags.data });
            } catch (error) {}
        },

        fetchData: async params => {
            const { pageSize } = get();

            try {
                set({ loading: true });

                const response = await getAnimeBangumi({
                    page: 1,
                    pageSize,
                    ...params
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

        loadMore: async params => {
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

                const response = await getAnimeBangumi({
                    page: nextPage,
                    pageSize,
                    ...params
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

export { useBangumiStore };
