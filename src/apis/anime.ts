import { HttpClient } from '@/lib/request';
import type {
    AnimeOptionsParams,
    AnimeOptionsRes,
    AnimeYouLikeParams,
    AnimeYouLikeRes,
    AnimeDetailParams,
    AnimeDetailRes,
    AnimeRecommendParams,
    AnimeRecommendRes,
    AnimeHotRankParams,
    AnimeHotRankRes,
    AnimeSuggestParams,
    AnimeSuggestRes,
    AnimeBangumiParams,
    AnimeBangumiRes,
    AnimeSearchParams,
    AnimeSearchRes
} from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/animes`;

const getAnimeOptions = (params: AnimeOptionsParams) => {
    return HttpClient.get<AnimeOptionsRes>(`${prefix}/options`, params);
};

const guessAnimeYouLike = (params: AnimeYouLikeParams) => {
    return HttpClient.get<AnimeYouLikeRes>(`${prefix}/guess-you-like`, params);
};

const getAnimeHotRank = (params: AnimeHotRankParams) => {
    return HttpClient.get<AnimeHotRankRes>(`${prefix}/hot-rank`, params);
};

const getAnimeDetail = (params: AnimeDetailParams) => {
    const { id } = params;
    return HttpClient.get<AnimeDetailRes>(`${prefix}/${id}`);
};

const getAnimeRecommend = (params: AnimeRecommendParams) => {
    const { id } = params;
    return HttpClient.get<AnimeRecommendRes>(`${prefix}/recommend/${id}`);
};

const getAnimeSuggest = (params: AnimeSuggestParams) => {
    return HttpClient.get<AnimeSuggestRes>(`${prefix}/suggest`, params);
};

const getAnimeBangumi = (params: AnimeBangumiParams) => {
    return HttpClient.get<AnimeBangumiRes>(`${prefix}/bangumi`, params);
};

const getAnimeSearch = (params: AnimeSearchParams) => {
    return HttpClient.get<AnimeSearchRes>(`${prefix}/search`, params);
};

export {
    getAnimeOptions,
    guessAnimeYouLike,
    getAnimeDetail,
    getAnimeRecommend,
    getAnimeHotRank,
    getAnimeSuggest,
    getAnimeBangumi,
    getAnimeSearch
};
