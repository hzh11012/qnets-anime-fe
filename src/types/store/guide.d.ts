import type { AnimeGuideItem } from '@/types';

interface GuideState {
    loading: boolean;
    list: AnimeGuideItem[];
    updateDay: string;
    page: number;
    pageSize: number;
    total: number;
}

interface GuideAction {
    setUpdateDay: (updateDay: string) => void;
    fetchData: () => Promise<void>;
    loadMore: () => Promise<void>;
}

export { GuideState, GuideAction };
