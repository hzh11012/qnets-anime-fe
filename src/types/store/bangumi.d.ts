import type { AnimeBangumiItem, AnimeBangumiParams } from '@/types';

interface BangumiState {
    tags: { label: string; value: string }[];
    loading: boolean;
    list: AnimeBangumiItem[];
    page: number;
    pageSize: number;
    total: number;
}

interface BangumiAction {
    fetchTagData: () => Promise<void>;
    fetchData: (params: AnimeBangumiParams) => Promise<void>;
    loadMore: (params: AnimeBangumiParams) => Promise<void>;
}

export { BangumiState, BangumiAction };
