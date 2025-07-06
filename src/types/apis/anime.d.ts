interface AnimeOption {
    id: string;
    name: string;
    remark: string;
    coverUrl: string;
    status: number;
    videoCount: number;
    videoId: string;
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
    videoId: string;
}

interface AnimeYouLikeRes {
    total: number;
    rows: AnimeYouLike[];
}

interface AnimeYouLikeParams {
    page?: number;
    pageSize?: number;
}

export {
    AnimeOptionsRes,
    AnimeOption,
    AnimeOptionsParams,
    AnimeYouLikeRes,
    AnimeYouLike,
    AnimeYouLikeParams
};
