import { HttpClient } from '@/lib/request';
import type { BannerOptionsRes } from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/anime-banners`;

const getBannerOptions= () => {
    return HttpClient.get<BannerOptionsRes>(`${prefix}/options`);
};

export { getBannerOptions};
