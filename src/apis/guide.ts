import { HttpClient } from '@/lib/request';
import type { AnimeGuideListParams, AnimeGuideListRes } from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/anime-guides`;

const getAnimeGuideList = (params: AnimeGuideListParams) => {
    return HttpClient.get<AnimeGuideListRes>(`${prefix}`, params);
};

export { getAnimeGuideList };
