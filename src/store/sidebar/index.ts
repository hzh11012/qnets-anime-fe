import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { SidebarStore } from '@/types';
import { getNoticeList, messageCreate } from '@/apis';

const DEFAULT_PAGE_SIZE = 10;
const LOADING_DELAY = import.meta.env.VITE_LOADING_DELAY;

const useSidebarStore = create<SidebarStore>()(
    devtools(
        immer((set, get) => ({
            notice: {
                list: [],
                page: 1,
                pageSize: DEFAULT_PAGE_SIZE,
                total: 0,
                loading: false,
                hasMore: true,
                fetchData: async () => {
                    const state = get();
                    const { pageSize } = state['notice'];

                    try {
                        set(state => {
                            state.notice.loading = true;
                        });

                        const response = await getNoticeList({
                            page: 1,
                            pageSize
                        });

                        const { rows = [], total = 0 } = response.data;
                        const hasMore = rows.length < total;
                        set(state => {
                            state.notice.list = rows;
                            state.notice.total = total;
                            state.notice.loading = false;
                            state.notice.hasMore = hasMore;
                        });
                    } catch (error) {
                        set(state => {
                            state.notice.loading = false;
                        });
                    }
                },
                loadMore: async () => {
                    const state = get();
                    const { list, loading, page, pageSize, hasMore } =
                        state['notice'];

                    // 检查是否可以加载更多
                    if (loading || !hasMore) return;

                    let loadingTimer: NodeJS.Timeout | null = null;

                    try {
                        // 延迟显示加载状态
                        loadingTimer = setTimeout(() => {
                            set(state => {
                                state.notice.loading = true;
                            });
                        }, LOADING_DELAY);

                        const nextPage = page + 1;

                        const response = await getNoticeList({
                            page: nextPage,
                            pageSize
                        });

                        // 清除定时器
                        if (loadingTimer) clearTimeout(loadingTimer);

                        const { rows = [], total = 0 } = response.data;
                        const newList = [...list, ...rows];
                        const newHasMore = newList.length < total;

                        set(state => {
                            state.notice.list = newList;
                            state.notice.page = nextPage;
                            state.notice.total = total;
                            state.notice.loading = false;
                            state.notice.hasMore = newHasMore;
                        });
                    } catch (error) {
                        // 清除定时器
                        if (loadingTimer) clearTimeout(loadingTimer);

                        set(state => {
                            state.notice.loading = false;
                        });
                    }
                },
                reset: () => {
                    set(state => {
                        state.notice.loading = false;
                        state.notice.list = [];
                        state.notice.page = 1;
                        state.notice.pageSize = DEFAULT_PAGE_SIZE;
                        state.notice.total = 0;
                        state.notice.hasMore = true;
                    });
                }
            },
            message: {
                loading: false,
                fetchData: async (data, cb) => {
                    try {
                        set(state => {
                            state.message.loading = true;
                        });

                        const response = await messageCreate(data);
                        if (response.code === 200) {
                            cb();
                        }

                        set(state => {
                            state.message.loading = false;
                        });
                    } catch (error) {
                        set(state => {
                            state.message.loading = false;
                        });
                    }
                }
            }
        }))
    )
);

export { useSidebarStore };
