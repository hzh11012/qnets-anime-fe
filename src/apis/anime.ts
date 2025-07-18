import { HttpClient } from '@/lib/request';
import type {
    AnimeOptionsParams,
    AnimeOptionsRes,
    AnimeYouLikeParams,
    AnimeYouLikeRes,
    AnimeDetailParams,
    AnimeDetailRes,
    AnimeRecommendParams,
    AnimeRecommendRes
} from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/animes`;

const getAnimeOptions = (params: AnimeOptionsParams) => {
    return HttpClient.get<AnimeOptionsRes>(`${prefix}/options`, params);
};

const guessAnimeYouLike = (params: AnimeYouLikeParams) => {
    return HttpClient.get<AnimeYouLikeRes>(`${prefix}/guess-you-like`, params);
};

const getAnimeDetail = (params: AnimeDetailParams) => {
    const { id } = params;
    return HttpClient.get<AnimeDetailRes>(`${prefix}/${id}`);
};

const getAnimeRecommend = (params: AnimeRecommendParams) => {
    const { id } = params;
    return HttpClient.get<AnimeRecommendRes>(`${prefix}/recommend/${id}`);
};

export {
    getAnimeOptions,
    guessAnimeYouLike,
    getAnimeDetail,
    getAnimeRecommend
};
