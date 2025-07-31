import type {
    AnimeDetailRes,
    AnimeRecommend,
    AnimeSeriesItem,
    DanmakuItem
} from '@/types';

interface AnimeAction {
    initialLoading: boolean;
    animeDetail: AnimeDetailRes | null;
    animeDanmaku: DanmakuItem[];
    animeLoading: boolean;
    animeRecommend: AnimeRecommend[];
    animeSeries: AnimeSeriesItem[];
    collectLoading: boolean;
    ratingLoading: boolean;
}

interface AnimeState {
    fetchAnimeDetailData: (id: string) => Promise<void>;
    fetchAnimeData: (id: string) => Promise<void>;
    fetchCollect: (id: string, isCollected: boolean) => Promise<void>;
    fetchRating: (
        id: string,
        data: { score: string; content: string },
        cb: () => void
    ) => Promise<void>;
    fetchPlay: (id: string) => Promise<void>;
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
