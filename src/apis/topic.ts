import { HttpClient } from '@/lib/request';
import type { TopicOptionsRes } from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/anime-topics`;

const getTopicOptions = () => {
    return HttpClient.get<TopicOptionsRes>(`${prefix}/options`);
};

export { getTopicOptions };
