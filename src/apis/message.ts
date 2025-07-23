import { HttpClient } from '@/lib/request';
import type { MessageCreateParams } from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/messages`;

const messageCreate = (params: MessageCreateParams) => {
    return HttpClient.post(`${prefix}`, params);
};

export { messageCreate };
