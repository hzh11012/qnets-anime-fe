import { HttpClient } from '@/lib/request';
import type { AnimeSeriesListParams, AnimeSeriesListRes } from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/anime-series`;

const getAnimeSeries = (params: AnimeSeriesListParams) => {
    const { id } = params;
    return HttpClient.get<AnimeSeriesListRes>(`${prefix}/${id}`);
};

export { getAnimeSeries };
