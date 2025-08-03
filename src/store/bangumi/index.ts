import { create } from 'zustand';
import type { BangumiState, BangumiAction } from '@/types';
import { getAnimeTag, getAnimeBangumi } from '@/apis';

const DEFAULT_PAGE_SIZE = 10;

// 定义加载延迟时间（毫秒）
const LOADING_DELAY = import.meta.env.VITE_LOADING_DELAY;

// 闭包变量用于管理计时器
let fetchTimer: NodeJS.Timeout | null = null;
let loadMoreTimer: NodeJS.Timeout | null = null;

const useBangumiStore = create<BangumiState & BangumiAction>((set, get) => ({
    tags: [],

    loading: false,
    list: [],
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,

    fetchTagData: async () => {
        const tags = await getAnimeTag();
        set({ tags: tags.data });
    },

    fetchData: async params => {
        // 清除之前的计时器
        if (fetchTimer) clearTimeout(fetchTimer);

        // 设置延迟显示加载状态
        fetchTimer = setTimeout(() => {
            set({ loading: true });
        }, LOADING_DELAY);

        try {
            const animes = await getAnimeBangumi({
                page: 1,
                pageSize: DEFAULT_PAGE_SIZE * 2,
                ...params
            });

            // 请求完成时清除计时器
            if (fetchTimer) clearTimeout(fetchTimer);

            set({
                list: animes.data.rows,
                page: 1,
                pageSize: DEFAULT_PAGE_SIZE,
                total: animes.data.total || 0,
                loading: false
            });
        } catch (error) {
            // 请求完成时清除计时器
            if (fetchTimer) clearTimeout(fetchTimer);
            set({ loading: false });
        }
    },

    loadMore: async params => {
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
            const ranks = await getAnimeBangumi({
                page: nextPage,
                pageSize: DEFAULT_PAGE_SIZE,
                ...params
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

export { useBangumiStore };
