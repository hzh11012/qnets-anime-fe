import { HttpClient } from '@/lib/request';
import type { AnimeOptionsParams, AnimeOptionsRes } from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/animes`;

const getAnimeOptions = (params: AnimeOptionsParams) => {
    return HttpClient.get<AnimeOptionsRes>(`${prefix}/options`, params);
};

export { getAnimeOptions };
