import { create } from 'zustand';
import type { HomeState, HomeAction } from '@/types';
import {
    getAnimeOptions,
    getBannerOptions,
    getCollectionOptions,
    getTopicOptions,
    guessAnimeYouLike
} from '@/apis';

const DEFAULT_PAGE_SIZE = 10;

const useHomeStore = create<HomeState & HomeAction>((set, get) => ({
    initialLoading: true,
    banners: [],
    animeTypes: [],
    topics: [],
    collections: [],
    recommended: {
        list: [],
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
        loading: false
    },

    fetchHomeData: async (types: string[]) => {
        set({ initialLoading: true });
        try {
            const [banners, topics, collections, likes, ...animeTypes] =
                await Promise.all([
                    getBannerOptions(),
                    getTopicOptions(),
                    getCollectionOptions(),
                    guessAnimeYouLike({ page: 1, pageSize: DEFAULT_PAGE_SIZE }),
                    ...types.map(type => getAnimeOptions({ type }))
                ]);

            set({
                banners: banners.data.rows,
                topics: topics.data.rows,
                collections: collections.data.rows,
                animeTypes: animeTypes.map(item => item.data.rows),
                recommended: {
                    list: likes.data.rows,
                    page: 1,
                    pageSize: DEFAULT_PAGE_SIZE,
                    total: likes.data.total || 0,
                    loading: false
                },
                initialLoading: false
            });
        } catch (error) {
            set({ initialLoading: false });
        }
    },

    loadMore: async () => {
        const state = get();
        const sectionState = state['recommended'];
        const loadedCount = sectionState.list.length;
        const hasMore = loadedCount < sectionState.total;
        // 检查是否正在加载或没有更多数据
        if (sectionState.loading || !hasMore) return;

        // 计算下一页
        const nextPage = sectionState.page + 1;

        try {
            // 设置加载状态
            set({ recommended: { ...sectionState, loading: true } });

            const { data } = await guessAnimeYouLike({
                page: nextPage,
                pageSize: DEFAULT_PAGE_SIZE
            });

            // 更新状态（保留现有视频，追加新视频）
            set({
                recommended: {
                    list: [...sectionState.list, ...(data.rows || [])],
                    page: nextPage,
                    pageSize: DEFAULT_PAGE_SIZE,
                    total: sectionState.total,
                    loading: false
                }
            });
        } catch (error) {
            set({ recommended: { ...sectionState, loading: false } });
        }
    }
}));

export { useHomeStore };
