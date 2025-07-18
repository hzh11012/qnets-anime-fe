import { HttpClient } from '@/lib/request';
import type {
    CollectionOptionsRes,
    CreateCollectionParams,
    CancelCollectionParams
} from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/anime-collections`;

const getCollectionOptions = () => {
    return HttpClient.get<CollectionOptionsRes>(`${prefix}/options`);
};

const createCollection = (params: CreateCollectionParams) => {
    return HttpClient.post(`${prefix}`, params);
};

const cancelCollection = (params: CancelCollectionParams) => {
    const { id } = params;
    return HttpClient.delete(`${prefix}/${id}`);
};

export { getCollectionOptions, createCollection, cancelCollection };
