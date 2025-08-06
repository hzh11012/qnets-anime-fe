import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { TopicDetailState, TopicDetailAction } from '@/types';
import { getTopicDetail, getTopicDetailList } from '@/apis';

const DEFAULT_PAGE_SIZE = 10;
const LOADING_DELAY = import.meta.env.VITE_LOADING_DELAY;

const useTopicDetailStore = create<TopicDetailState & TopicDetailAction>()(
    devtools((set, get) => ({
        detail: null,
        loading: false,
        list: [],
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,

        fetachTopicDetail: async id => {
            try {
                const topicDetail = await getTopicDetail({ id });
                set({ detail: topicDetail.data });
            } catch (error) {
                throw error;
            }
        },

        fetchData: async id => {
            const { pageSize } = get();

            try {
                set({ loading: true });

                const response = await getTopicDetailList({
                    id,
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

        loadMore: async id => {
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

                const response = await getTopicDetailList({
                    id,
                    page: nextPage,
                    pageSize
                });

                // 清除定时器
                if (loadingTimer) clearTimeout(loadingTimer);

                const { rows = [], total = 0 } = response.data;
                const newList = [...list, ...rows];
                const newHasMore = newList.length < total;

                // 更新状态
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
                detail: null,
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

export { useTopicDetailStore };
