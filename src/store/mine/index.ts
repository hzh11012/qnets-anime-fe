import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { MineStore } from '@/types';
import { userEdit } from '@/apis';
import { getCollectionList, getHistoryList } from '@/apis';

const DEFAULT_PAGE_SIZE = 25;
const LOADING_DELAY = import.meta.env.VITE_LOADING_DELAY;

const useMineStore = create<MineStore>()(
    devtools(
        immer((set, get) => ({
            user: {
                loading: false,
                fetchData: async (data, cb) => {
                    try {
                        set(state => {
                            state.user.loading = true;
                        });

                        const response = await userEdit(data);
                        if (response.code === 200) {
                            cb();
                        }

                        set(state => {
                            state.user.loading = false;
                        });
                    } catch (error) {
                        set(state => {
                            state.user.loading = false;
                        });
                    }
                }
            },
            collection: {
                loading: false,
                list: [],
                page: 1,
                pageSize: DEFAULT_PAGE_SIZE,
                total: 0,
                hasMore: true,

                fetchData: async () => {
                    const state = get();
                    const { pageSize } = state['collection'];

                    try {
                        set(state => {
                            state.collection.loading = true;
                        });

                        const response = await getCollectionList({
                            page: 1,
                            pageSize
                        });

                        const { rows = [], total = 0 } = response.data;
                        const hasMore = rows.length < total;
                        set(state => {
                            state.collection.list = rows;
                            state.collection.total = total;
                            state.collection.loading = false;
                            state.collection.hasMore = hasMore;
                        });
                    } catch (error) {
                        set(state => {
                            state.collection.loading = false;
                        });
                    }
                },

                loadMore: async () => {
                    const state = get();
                    const { list, loading, page, pageSize, hasMore } =
                        state['collection'];

                    // 检查是否可以加载更多
                    if (loading || !hasMore) return;

                    let loadingTimer: NodeJS.Timeout | null = null;

                    try {
                        // 延迟显示加载状态
                        loadingTimer = setTimeout(() => {
                            set(state => {
                                state.collection.loading = true;
                            });
                        }, LOADING_DELAY);

                        const nextPage = page + 1;

                        const response = await getCollectionList({
                            page: nextPage,
                            pageSize
                        });

                        // 清除定时器
                        if (loadingTimer) clearTimeout(loadingTimer);

                        const { rows = [], total = 0 } = response.data;
                        const newList = [...list, ...rows];
                        const newHasMore = newList.length < total;

                        set(state => {
                            state.collection.list = newList;
                            state.collection.page = nextPage;
                            state.collection.total = total;
                            state.collection.loading = false;
                            state.collection.hasMore = newHasMore;
                        });
                    } catch (error) {
                        // 清除定时器
                        if (loadingTimer) clearTimeout(loadingTimer);

                        set(state => {
                            state.collection.loading = false;
                        });
                    }
                },

                reset: () => {
                    set(state => {
                        state.collection.loading = false;
                        state.collection.list = [];
                        state.collection.page = 1;
                        state.collection.pageSize = DEFAULT_PAGE_SIZE;
                        state.collection.total = 0;
                        state.collection.hasMore = true;
                    });
                }
            },
            history: {
                loading: false,
                list: [],
                page: 1,
                pageSize: DEFAULT_PAGE_SIZE,
                total: 0,
                hasMore: true,

                fetchData: async () => {
                    const state = get();
                    const { pageSize } = state['history'];

                    try {
                        set(state => {
                            state.history.loading = true;
                        });

                        const response = await getHistoryList({
                            page: 1,
                            pageSize
                        });

                        const { rows = [], total = 0 } = response.data;
                        const hasMore = rows.length < total;
                        set(state => {
                            state.history.list = rows;
                            state.history.total = total;
                            state.history.loading = false;
                            state.history.hasMore = hasMore;
                        });
                    } catch (error) {
                        set(state => {
                            state.history.loading = false;
                        });
                    }
                },

                loadMore: async () => {
                    const state = get();
                    const { list, loading, page, pageSize, hasMore } =
                        state['history'];

                    // 检查是否可以加载更多
                    if (loading || !hasMore) return;

                    let loadingTimer: NodeJS.Timeout | null = null;

                    try {
                        // 延迟显示加载状态
                        loadingTimer = setTimeout(() => {
                            set(state => {
                                state.history.loading = true;
                            });
                        }, LOADING_DELAY);

                        const nextPage = page + 1;

                        const response = await getHistoryList({
                            page: nextPage,
                            pageSize
                        });

                        // 清除定时器
                        if (loadingTimer) clearTimeout(loadingTimer);

                        const { rows = [], total = 0 } = response.data;
                        const newList = [...list, ...rows];
                        const newHasMore = newList.length < total;

                        set(state => {
                            state.history.list = newList;
                            state.history.page = nextPage;
                            state.history.total = total;
                            state.history.loading = false;
                            state.history.hasMore = newHasMore;
                        });
                    } catch (error) {
                        // 清除定时器
                        if (loadingTimer) clearTimeout(loadingTimer);

                        set(state => {
                            state.history.loading = false;
                        });
                    }
                },

                reset: () => {
                    set(state => {
                        state.history.loading = false;
                        state.history.list = [];
                        state.history.page = 1;
                        state.history.pageSize = DEFAULT_PAGE_SIZE;
                        state.history.total = 0;
                        state.history.hasMore = true;
                    });
                }
            }
        }))
    )
);

export { useMineStore };
