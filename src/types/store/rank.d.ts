import type { AnimeHotRank } from '@/types';

interface RankState {
    loading: boolean;
    list: AnimeHotRank[];
    page: number;
    pageSize: number;
    total: number;
}

interface RankAction {
    fetchData: () => Promise<void>;
    loadMore: () => Promise<void>;
}

export { RankState, RankAction };
