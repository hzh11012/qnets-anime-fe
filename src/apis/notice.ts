import { HttpClient } from '@/lib/request';
import type { NoticeListParams, NoticeListRes } from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/notices`;

const getNoticeList = (params: NoticeListParams) => {
    return HttpClient.get<NoticeListRes>(`${prefix}`, params);
};

export { getNoticeList };
