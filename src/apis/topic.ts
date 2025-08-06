import { HttpClient } from '@/lib/request';
import type {
    TopicRes,
    TopicParams,
    TopicOptionsRes,
    TopicDetailParams,
    TopicDetailRes,
    TopicDetailListParams,
    TopicDetailListRes
} from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}/anime-topics`;

const getTopicOptions = () => {
    return HttpClient.get<TopicOptionsRes>(`${prefix}/options`);
};

const getTopicList = (params: TopicParams) => {
    return HttpClient.get<TopicRes>(`${prefix}`, params);
};

const getTopicDetail = (params: TopicDetailParams) => {
    const { id } = params;
    return HttpClient.get<TopicDetailRes>(`${prefix}/${id}`);
};

const getTopicDetailList = (params: TopicDetailListParams) => {
    const { id, ...rest } = params;
    return HttpClient.get<TopicDetailListRes>(`${prefix}/${id}/animes`, rest);
};

export { getTopicOptions, getTopicList, getTopicDetailList, getTopicDetail };
