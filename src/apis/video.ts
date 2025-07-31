import { HttpClient } from '@/lib/request';
import type { VideoPlayParams } from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/videos`;

const incrementPlayCount = (params: VideoPlayParams) => {
    const { id } = params;
    return HttpClient.post(`${prefix}/${id}/play`);
};

export { incrementPlayCount };
