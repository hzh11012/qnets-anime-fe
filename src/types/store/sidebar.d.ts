import type { NoticeItem } from '@/types';

interface SidebarStore {
    notice: {
        loading: boolean;
        list: NoticeItem[];
        page: number;
        pageSize: number;
        total: number;
        hasMore: boolean;
        fetchData: () => Promise<void>;
        loadMore: () => Promise<void>;
        reset: () => void;
    };
    message: {
        loading: boolean;
        fetchData: (
            data: { type: '0' | '1' | '2' | '3'; content: string },
            cb: () => void
        ) => Promise<void>;
    };
}

export { SidebarStore };
