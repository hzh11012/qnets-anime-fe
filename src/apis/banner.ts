import { HttpClient } from '@/lib/request';
import type { BannerListRes } from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/anime-banners`;

const getBannerList = () => {
    return HttpClient.get<BannerListRes>(`${prefix}/options`);
};

export { getBannerList };
