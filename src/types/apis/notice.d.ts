interface NoticeItem {
    id: string;
    title: string;
    content: string;
    createdAt: string;
}

interface NoticeListRes {
    total: number;
    rows: NoticeItem[];
}

interface NoticeListParams {
    page?: number;
    pageSize?: number;
}

export { NoticeItem, NoticeListRes, NoticeListParams };
