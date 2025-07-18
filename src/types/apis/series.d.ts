interface AnimeSeriesListParams {
    id: string;
}

interface AnimeSeriesItem {
    name: string;
    coverUrl: string;
    status: number;
    videoCount: number;
    playCount: number;
    collectionCount: number;
    videoId?: string;
}

interface AnimeSeriesListRes {
    total: number;
    rows: AnimeSeriesItem[];
}

export { AnimeSeriesListRes, AnimeSeriesItem, AnimeSeriesListParams };
