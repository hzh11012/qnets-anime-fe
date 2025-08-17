import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { HomeState, HomeAction } from '@/types';
import {
    getAnimeOptions,
    getBannerOptions,
    getCollectionOptions,
    getTopicOptions,
    guessAnimeYouLike
} from '@/apis';

const DEFAULT_PAGE_SIZE = 25;
const LOADING_DELAY = import.meta.env.VITE_LOADING_DELAY;

const useHomeStore = create<HomeState & HomeAction>()(
    devtools(
        immer((set, get) => ({
            initialLoading: false,
            banners: [],
            animeTypes: [],
            topics: [],
            collections: [],
            likes: {
                list: [],
                page: 1,
                pageSize: DEFAULT_PAGE_SIZE,
                total: 0,
                loading: false,
                hasMore: true
            },

            fetchData: async (types: string[]) => {
                const state = get();
                const { pageSize } = state['likes'];

                try {
                    set({ initialLoading: true });

                    const [banners, topics, collections, likes, ...animeTypes] =
                        await Promise.all([
                            getBannerOptions(),
                            getTopicOptions(),
                            getCollectionOptions(),
                            guessAnimeYouLike({
                                page: 1,
                                pageSize
                            }),
                            ...types.map(type => getAnimeOptions({ type }))
                        ]);

                    const { rows = [], total = 0 } = likes.data;
                    const hasMore = rows.length < total;
                    set(state => {
                        state.banners = banners.data.rows;
                        state.topics = topics.data.rows;
                        state.collections = collections.data.rows;
                        state.animeTypes = animeTypes.map(
                            item => item.data.rows
                        );
                        state.likes.list = likes.data.rows;
                        state.likes.total = likes.data.total;
                        state.likes.hasMore = hasMore;
                        state.initialLoading = false;
                    });
                } catch (error) {
                    set({ initialLoading: false });
                }
            },

            loadMore: async () => {
                const state = get();
                const { list, loading, page, pageSize, hasMore } =
                    state['likes'];

                // 检查是否可以加载更多
                if (loading || !hasMore) return;

                let loadingTimer: NodeJS.Timeout | null = null;

                try {
                    // 延迟显示加载状态
                    loadingTimer = setTimeout(() => {
                        set(state => {
                            state.likes.loading = true;
                        });
                    }, LOADING_DELAY);

                    const nextPage = page + 1;

                    const response = await guessAnimeYouLike({
                        page: nextPage,
                        pageSize
                    });

                    // 清除定时器
                    if (loadingTimer) clearTimeout(loadingTimer);

                    const { rows = [], total = 0 } = response.data;
                    const newList = [...list, ...rows];
                    const newHasMore = newList.length < total;

                    set(state => {
                        state.likes.list = newList;
                        state.likes.page = nextPage;
                        state.likes.total = total;
                        state.likes.loading = false;
                        state.likes.hasMore = newHasMore;
                    });
                } catch (error) {
                    // 清除定时器
                    if (loadingTimer) clearTimeout(loadingTimer);

                    set(state => {
                        state.likes.loading = false;
                    });
                }
            },

            reset: () => {
                set({
                    initialLoading: false,
                    banners: [],
                    animeTypes: [],
                    topics: [],
                    collections: [],
                    likes: {
                        list: [],
                        page: 1,
                        pageSize: DEFAULT_PAGE_SIZE,
                        total: 0,
                        loading: false,
                        hasMore: true
                    }
                });
            }
        }))
    )
);

export { useHomeStore };
