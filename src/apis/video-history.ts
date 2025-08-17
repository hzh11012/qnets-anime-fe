import { HttpClient } from '@/lib/request';
import type {
    VideoHistoryCreateParams,
    VideoHistoryListParams,
    VideoHistoryListRes
} from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/video-histories`;

const saveHistory = (params: VideoHistoryCreateParams) => {
    const { id, ...rest } = params;
    return HttpClient.post(`${prefix}/${id}`, rest);
};

const getHistoryList = (params: VideoHistoryListParams) => {
    return HttpClient.get<VideoHistoryListRes>(`${prefix}`, params);
};

export { saveHistory, getHistoryList };
