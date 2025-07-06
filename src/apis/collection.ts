import { HttpClient } from '@/lib/request';
import type { CollectionOptionsRes } from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/anime-collections`;

const getCollectionOptions = () => {
    return HttpClient.get<CollectionOptionsRes>(`${prefix}/options`);
};

export { getCollectionOptions };
