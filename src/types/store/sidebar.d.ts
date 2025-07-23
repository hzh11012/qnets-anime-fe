import type { NoticeItem } from '@/types';

interface SidebarState {
    notices: {
        list: NoticeItem[];
        page: number;
        pageSize: number;
        total: number;
        loading: boolean;
    };
    messageLoading: boolean;
}

interface SidebarAction {
    fetchNoticeData: () => Promise<void>;
    loadMore: () => Promise<void>;
    fetchMessage: (
        data: { type: '0' | '1' | '2' | '3'; content: string },
        cb: () => void
    ) => Promise<void>;
}

export { SidebarState, SidebarAction };
