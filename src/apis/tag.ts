import { HttpClient } from '@/lib/request';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/anime-tags`;

const getAnimeTag = () => {
    return HttpClient.get<{ label: string; value: string }[]>(
        `${prefix}/options`
    );
};

export { getAnimeTag };
