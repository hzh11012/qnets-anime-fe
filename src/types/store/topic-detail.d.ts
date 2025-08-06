import type { AnimeHotRank, TopicDetailRes } from '@/types';

interface TopicDetailState {
    detail: TopicDetailRes | null;
    loading: boolean;
    list: AnimeHotRank[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
}

interface TopicDetailAction {
    fetachTopicDetail: (id: string) => Promise<void>;
    fetchData: (id: string) => Promise<void>;
    loadMore: (id: string) => Promise<void>;
    reset: () => void;
}

export { TopicDetailState, TopicDetailAction };
