import { HttpClient } from '@/lib/request';
import type { VideoHistoryCreateParams } from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/video-histories`;

const saveHistory = (params: VideoHistoryCreateParams) => {
    const { id, ...rest } = params;
    return HttpClient.post(`${prefix}/${id}`, rest);
};

export { saveHistory };
