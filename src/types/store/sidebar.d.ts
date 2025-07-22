import type { NoticeItem } from '@/types';

interface SidebarState {
    notices: {
        list: NoticeItem[];
        page: number;
        pageSize: number;
        total: number;
        loading: boolean;
    };
}

interface SidebarAction {
    fetchNoticeData: () => Promise<void>;
    loadMore: () => Promise<void>;
}

export { SidebarState, SidebarAction };
