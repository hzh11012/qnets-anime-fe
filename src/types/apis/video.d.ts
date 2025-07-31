interface VideoPlayParams {
    id: string;
}

interface VideoHistoryCreateParams {
    id: string;
    animeId: string;
    time: number;
}

export { VideoPlayParams, VideoHistoryCreateParams };
