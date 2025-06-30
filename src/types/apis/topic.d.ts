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

export { TopicOptionsRes, TopicOption };
