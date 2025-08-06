import type { AnimeGuideItem } from '@/types';

interface GuideState {
    loading: boolean;
    list: AnimeGuideItem[];
    updateDay: string;
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
}

interface GuideAction {
    fetchData: () => Promise<void>;
    loadMore: () => Promise<void>;
    toggleDay: (updateDay: string) => Promise<void>;
    reset: () => void;
}

export { GuideState, GuideAction };
