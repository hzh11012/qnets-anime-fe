import { create } from 'zustand';
import type { GuideState, GuideAction } from '@/types';
import { getAnimeGuideList } from '@/apis';

const DEFAULT_PAGE_SIZE = 10;

const useGuideStore = create<GuideState & GuideAction>((set, get) => ({
    loading: false,
    list: [],
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
    total: 0,
    updateDay: new Date().getDay().toString(),

    fetchData: async () => {
        const { updateDay } = get();
        set({ loading: true });
        try {
            const ranks = await getAnimeGuideList({
                updateDay,
                page: 1,
                pageSize: DEFAULT_PAGE_SIZE
            });

            set({
                list: ranks.data.rows,
                page: 1,
                pageSize: DEFAULT_PAGE_SIZE,
                total: ranks.data.total || 0,
                loading: false
            });
        } catch (error) {
            set({ loading: false });
        }
    },

    loadMore: async () => {
        const { list, total, loading, page, updateDay } = get();
        const loadedCount = list.length;
        const hasMore = loadedCount < total;
        // 检查是否正在加载或没有更多数据
        if (loading || !hasMore) return;

        // 计算下一页
        const nextPage = page + 1;

        try {
            // 设置加载状态
            set({ loading: true });

            const ranks = await getAnimeGuideList({
                updateDay,
                page: nextPage,
                pageSize: DEFAULT_PAGE_SIZE
            });

            // 更新状态（保留现有视频，追加新视频）
            set({
                list: [...list, ...(ranks.data.rows || [])],
                page: nextPage,
                pageSize: DEFAULT_PAGE_SIZE,
                total: ranks.data.total,
                loading: false
            });
        } catch (error) {
            set({ loading: false });
        }
    },

    setUpdateDay: (updateDay: string) => {
        const { fetchData } = get();
        set({ updateDay });
        fetchData();
    }
}));

export { useGuideStore };
