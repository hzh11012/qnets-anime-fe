import type { TopicOption } from '@/types';

interface TopicState {
    loading: boolean;
    list: TopicOption[];
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
}

interface TopicAction {
    fetchData: () => Promise<void>;
    loadMore: () => Promise<void>;
    reset: () => void;
}

export { TopicState, TopicAction };
