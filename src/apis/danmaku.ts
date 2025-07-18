import { HttpClient } from '@/lib/request';
import type {
    DanmakuListParams,
    DanmakuListRes,
    DanmakuCreateParams
} from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/danmakus`;

const getDanmakuList = (params: DanmakuListParams) => {
    const { id } = params;
    return HttpClient.get<DanmakuListRes>(`${prefix}/${id}`);
};

const danmakuCreate = (params: DanmakuCreateParams) => {
    const { id, ...rest } = params;
    return HttpClient.post(`${prefix}/${id}`, rest);
};

export { getDanmakuList, danmakuCreate };
