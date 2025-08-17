interface VideoPlayParams {
    id: string;
}

interface VideoHistoryCreateParams {
    id: string;
    animeId: string;
    time: number;
}

interface VideoHistoryListParams {
    page?: number;
    pageSize?: number;
}

interface VideoHistoryItem {
    id: string;
    name: string;
    time: number;
    bannerUrl: string;
    updatedAt: string;
    video: {
        title: string;
        episode: number;
    };
    videoId: string;
}

interface VideoHistoryListRes {
    total: number;
    rows: VideoHistoryItem[];
}

export {
    VideoPlayParams,
    VideoHistoryCreateParams,
    VideoHistoryListParams,
    VideoHistoryItem,
    VideoHistoryListRes
};
