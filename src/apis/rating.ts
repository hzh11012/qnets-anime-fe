import { HttpClient } from '@/lib/request';
import type { CreateRatingParams } from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/anime-ratings`;

const createRating = (params: CreateRatingParams) => {
    return HttpClient.post(`${prefix}`, params);
};

export { createRating };
