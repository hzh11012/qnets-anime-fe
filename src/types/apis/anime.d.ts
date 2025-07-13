interface AnimeOption {
    id: string;
    name: string;
    remark: string;
    coverUrl: string;
    status: number;
    videoCount: number;
    videoId?: string;
}

interface AnimeOptionsRes {
    total: number;
    rows: AnimeOption[];
}

interface AnimeOptionsParams {
    type: string;
}

interface AnimeYouLike {
    id: string;
    name: string;
    remark: string;
    bannerUrl: string;
    status: number;
    type: number;
    videoCount: number;
    videoId?: string;
}

interface AnimeYouLikeRes {
    total: number;
    rows: AnimeYouLike[];
}

interface AnimeYouLikeParams {
    page?: number;
    pageSize?: number;
}

interface AnimeDetailParams {
    id: string;
}

interface AnimeDetailRes {
    anime: {
        name: string;
        status: number;
        description: string;
    };
    avgRating: number;
    collectionCount: number;
    isRating: boolean;
    playCount: number;
    video: {
        animeId: string;
        title: string;
        url: string;
        episode: number;
    };
    videoCount: number;
    isCollected: boolean;
    time: number;
    videoList: {
        id: string;
        episode: number;
        title: string;
    }[];
}

export {
    AnimeOptionsRes,
    AnimeOption,
    AnimeOptionsParams,
    AnimeYouLikeRes,
    AnimeYouLike,
    AnimeYouLikeParams,
    AnimeDetailRes,
    AnimeDetailParams
};
