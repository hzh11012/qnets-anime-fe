import type {
    AnimeDetailRes,
    AnimeRecommend,
    AnimeSeriesItem,
    DanmakuItem
} from '@/types';

interface AnimeAction {
    initialLoading: boolean;
    detail: AnimeDetailRes | null;
    danmakus: DanmakuItem[];
    animeLoading: boolean;
    recommendations: AnimeRecommend[];
    series: AnimeSeriesItem[];
    collectLoading: boolean;
    ratingLoading: boolean;
}

interface AnimeState {
    fetchDetailData: (id: string) => Promise<void>;
    fetchAnimeData: (id: string) => Promise<void>;
    fetchCollect: (id: string) => Promise<void>;
    fetchRating: (
        id: string,
        data: { score: string; content: string },
        cb: () => void
    ) => Promise<void>;
    incrementPlayCount: (id: string) => Promise<void>;
    saveHistory: ({
        id,
        animeId,
        time
    }: {
        id: string;
        animeId: string;
        time: number;
    }) => Promise<void>;
}

export { AnimeState, AnimeAction };
