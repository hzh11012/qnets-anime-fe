interface AnimeGuideItem {
    id: string;
    name: string;
    remark: string;
    coverUrl: string;
    status: number;
    videoCount: number;
    videoId?: string;
    updateTime: string;
}

interface AnimeGuideListRes {
    total: number;
    rows: AnimeGuideItem[];
}

interface AnimeGuideListParams {
    updateDay: string;
    page?: number;
    pageSize?: number;
}

export { AnimeGuideItem, AnimeGuideListParams, AnimeGuideListRes };
