import { create } from 'zustand';
import type { SidebarState, SidebarAction } from '@/types';
import { getNoticeList } from '@/apis';

const DEFAULT_PAGE_SIZE = 10;

const useSidebarStore = create<SidebarState & SidebarAction>((set, get) => ({
    notices: {
        list: [],
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
        loading: false
    },

    fetchNoticeData: async () => {
        const state = get();
        const noticeState = state['notices'];
        set({ notices: { ...noticeState, loading: true } });
        try {
            const notices = await getNoticeList({
                page: 1,
                pageSize: DEFAULT_PAGE_SIZE
            });

            set({
                notices: {
                    list: notices.data.rows,
                    page: 1,
                    pageSize: DEFAULT_PAGE_SIZE,
                    total: notices.data.total || 0,
                    loading: false
                }
            });
        } catch (error) {
            set({ notices: { ...noticeState, loading: false } });
        }
    },

    loadMore: async () => {
        const state = get();
        const noticeState = state['notices'];
        const loadedCount = noticeState.list.length;
        const hasMore = loadedCount < noticeState.total;
        // 检查是否正在加载或没有更多数据
        if (noticeState.loading || !hasMore) return;

        // 计算下一页
        const nextPage = noticeState.page + 1;

        try {
            // 设置加载状态
            set({ notices: { ...noticeState, loading: true } });

            const { data } = await getNoticeList({
                page: nextPage,
                pageSize: DEFAULT_PAGE_SIZE
            });

            // 更新状态（保留现有视频，追加新视频）
            set({
                notices: {
                    list: [...noticeState.list, ...(data.rows || [])],
                    page: nextPage,
                    pageSize: DEFAULT_PAGE_SIZE,
                    total: noticeState.total,
                    loading: false
                }
            });
        } catch (error) {
            set({ notices: { ...noticeState, loading: false } });
        }
    }
}));

export { useSidebarStore };
