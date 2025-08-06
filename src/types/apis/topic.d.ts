import type { AnimeHotRank } from '@/types';

interface TopicOption {
    id: string;
    name: string;
    coverUrl: string;
    count: number;
}

interface TopicOptionsRes {
    total: number;
    rows: TopicOption[];
}

interface TopicParams {
    page?: number;
    pageSize?: number;
}

interface TopicDetailParams {
    id: string;
}

interface TopicDetailListParams extends TopicParams {
    id: string;
}

interface TopicRes extends TopicOptionsRes {}

interface TopicDetailRes {
    id: string;
    name: string;
    coverUrl: string;
    description: string;
}

interface TopicDetailListRes {
    total: number;
    rows: AnimeHotRank[];
}

export {
    TopicOptionsRes,
    TopicOption,
    TopicParams,
    TopicRes,
    TopicDetailRes,
    TopicDetailParams,
    TopicDetailRes,
    TopicDetailListParams,
    TopicDetailListRes
};
