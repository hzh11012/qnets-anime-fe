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
    name: string;
    description: string;
    status: number;
    averageRating: number;
    playCount: number;
    videoCount: number;
    collectionCount: number;
    time?: number;
    video: {
        id: string;
        animeId: string;
        title: string;
        url: string;
        episode: number;
    };
    videoList: {
        id: string;
        episode: number;
        title: string;
    }[];
    isCollected: boolean;
    isRating: boolean;
}

interface AnimeRecommendParams {
    id: string;
}

interface AnimeRecommend {
    id: string;
    name: string;
    bannerUrl: string;
    status: number;
    videoCount: number;
    playCount: number;
    collectionCount: number;
    averageRating: number;
    videoId?: string;
}

interface AnimeRecommendRes {
    total: number;
    rows: AnimeRecommend[];
}

interface AnimeHotRank {
    id: string;
    name: string;
    remark: string;
    coverUrl: string;
    status: number;
    videoCount: number;
    videoId?: string;
}

interface AnimeHotRankRes {
    total: number;
    rows: AnimeHotRank[];
}

interface AnimeHotRankParams {
    page?: number;
    pageSize?: number;
}

interface AnimeSuggestItem {
    name: string;
    highlightName: string;
}

interface AnimeSuggestParams {
    keyword: string;
}

interface AnimeSuggestRes {
    total: number;
    rows: AnimeSuggestItem[];
}

interface AnimeBangumiItem {
    id: string;
    name: string;
    coverUrl: string;
    status: number;
    videoCount: number;
    videoId?: string;
}

interface AnimeBangumiParams {
    page?: number;
    pageSize?: number;
    order?: string;
    type?: string;
    tag?: string;
    status?: string;
    year?: string;
    month?: string;
}

interface AnimeBangumiRes {
    total: number;
    rows: AnimeBangumiItem[];
}

export {
    AnimeOptionsRes,
    AnimeOption,
    AnimeOptionsParams,
    AnimeYouLikeRes,
    AnimeYouLike,
    AnimeYouLikeParams,
    AnimeDetailRes,
    AnimeDetailParams,
    AnimeRecommendRes,
    AnimeRecommend,
    AnimeRecommendParams,
    AnimeHotRankRes,
    AnimeHotRank,
    AnimeHotRankParams,
    AnimeSuggestItem,
    AnimeSuggestRes,
    AnimeSuggestParams,
    AnimeBangumiItem,
    AnimeBangumiRes,
    AnimeBangumiParams
};
