import { create } from 'zustand';
import type { RankState, RankAction } from '@/types';
import { getAnimeHotRank } from '@/apis';

const DEFAULT_PAGE_SIZE = 10;

// 定义加载延迟时间（毫秒）
const LOADING_DELAY = import.meta.env.VITE_LOADING_DELAY;

// 闭包变量用于管理计时器
let fetchTimer: NodeJS.Timeout | null = null;
let loadMoreTimer: NodeJS.Timeout | null = null;

const useRankStore = create<RankState & RankAction>((set, get) => ({
    loading: false,
    list: [],
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,

    fetchData: async () => {
        // 清除之前的计时器
        if (fetchTimer) clearTimeout(fetchTimer);

        // 设置延迟显示加载状态
        fetchTimer = setTimeout(() => {
            set({ loading: true });
        }, LOADING_DELAY);

        try {
            const ranks = await getAnimeHotRank({
                page: 1,
                pageSize: DEFAULT_PAGE_SIZE * 2
            });

            // 请求完成时清除计时器
            if (fetchTimer) clearTimeout(fetchTimer);

            set({
                list: ranks.data.rows,
                page: 1,
                pageSize: DEFAULT_PAGE_SIZE,
                total: ranks.data.total || 0,
                loading: false
            });
        } catch (error) {
            // 请求完成时清除计时器
            if (fetchTimer) clearTimeout(fetchTimer);
            set({ loading: false });
        }
    },

    loadMore: async () => {
        const { list, total, loading, page } = get();
        const loadedCount = list.length;
        const hasMore = loadedCount < total;
        // 检查是否正在加载或没有更多数据
        if (loading || !hasMore) return;

        // 清除之前的计时器
        if (loadMoreTimer) clearTimeout(loadMoreTimer);

        // 设置延迟显示加载状态
        loadMoreTimer = setTimeout(() => {
            set({ loading: true });
        }, LOADING_DELAY);

        // 计算下一页
        const nextPage = page + 1;

        try {
            const ranks = await getAnimeHotRank({
                page: nextPage,
                pageSize: DEFAULT_PAGE_SIZE
            });

            // 请求完成时清除计时器
            if (loadMoreTimer) clearTimeout(loadMoreTimer);

            // 更新状态（保留现有视频，追加新视频）
            set({
                list: [...list, ...(ranks.data.rows || [])],
                page: nextPage,
                pageSize: DEFAULT_PAGE_SIZE,
                total: ranks.data.total,
                loading: false
            });
        } catch (error) {
            // 请求完成时清除计时器
            if (loadMoreTimer) clearTimeout(loadMoreTimer);
            set({ loading: false });
        }
    }
}));

export { useRankStore };
