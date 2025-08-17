import type { CollectionItem, HistoryItem } from '@/types';

interface MineStore {
    user: {
        loading: boolean;
        fetchData: (
            data: { nickname: string },
            cb: () => void
        ) => Promise<void>;
    };
    collection: {
        loading: boolean;
        list: CollectionItem[];
        page: number;
        pageSize: number;
        total: number;
        hasMore: boolean;
        fetchData: () => Promise<void>;
        loadMore: () => Promise<void>;
        reset: () => void;
    };
    history: {
        loading: boolean;
        list: HistoryItem[];
        page: number;
        pageSize: number;
        total: number;
        hasMore: boolean;
        fetchData: () => Promise<void>;
        loadMore: () => Promise<void>;
        reset: () => void;
    };
}

export { MineStore };
