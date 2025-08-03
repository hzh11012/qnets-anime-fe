import { create } from 'zustand';
import type { SidebarState, SidebarAction } from '@/types';
import { getNoticeList, messageCreate } from '@/apis';

const DEFAULT_PAGE_SIZE = 10;

// 定义加载延迟时间（毫秒）
const LOADING_DELAY = import.meta.env.VITE_LOADING_DELAY;

// 闭包变量用于管理计时器
let fetchTimer: NodeJS.Timeout | null = null;
let loadMoreTimer: NodeJS.Timeout | null = null;

const useSidebarStore = create<SidebarState & SidebarAction>((set, get) => ({
    notices: {
        list: [],
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        total: 0,
        loading: false
    },
    messageLoading: false,

    fetchNoticeData: async () => {
        const state = get();
        const noticeState = state['notices'];

        // 清除之前的计时器
        if (fetchTimer) clearTimeout(fetchTimer);

        // 设置延迟显示加载状态
        fetchTimer = setTimeout(() => {
            set({ notices: { ...noticeState, loading: true } });
        }, LOADING_DELAY);

        try {
            const notices = await getNoticeList({
                page: 1,
                pageSize: DEFAULT_PAGE_SIZE
            });

            // 请求完成时清除计时器
            if (fetchTimer) clearTimeout(fetchTimer);

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
            // 请求完成时清除计时器
            if (fetchTimer) clearTimeout(fetchTimer);
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

        // 清除之前的计时器
        if (loadMoreTimer) clearTimeout(loadMoreTimer);

        // 设置延迟显示加载状态
        loadMoreTimer = setTimeout(() => {
            set({ notices: { ...noticeState, loading: true } });
        }, LOADING_DELAY);

        // 计算下一页
        const nextPage = noticeState.page + 1;

        try {
            const { data } = await getNoticeList({
                page: nextPage,
                pageSize: DEFAULT_PAGE_SIZE
            });

            // 请求完成时清除计时器
            if (loadMoreTimer) clearTimeout(loadMoreTimer);

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
            // 请求完成时清除计时器
            if (loadMoreTimer) clearTimeout(loadMoreTimer);
            set({ notices: { ...noticeState, loading: false } });
        }
    },

    fetchMessage: async (data, cb) => {
        set({ messageLoading: true });
        try {
            const res = await messageCreate(data);
            if (res?.code === 200) {
                cb();
            }
            set({ messageLoading: false });
        } catch (error) {
            set({ messageLoading: false });
        }
    }
}));

export { useSidebarStore };
