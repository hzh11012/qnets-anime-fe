interface CollectionOption {
    id: string;
    name: string;
    time: number;
    bannerUrl: string;
    status: number;
    videoCount: string;
    episode: string;
    videoId?: string;
}

interface CollectionOptionsRes {
    total: number;
    rows: CollectionOption[];
}

interface CreateCollectionParams {
    id: string;
}

interface CancelCollectionParams {
    id: string;
}

interface CollectionListParams {
    page?: number;
    pageSize?: number;
}

interface CollectionItem {
    id: string;
    name: string;
    remark: string;
    coverUrl: string;
    status: number;
    videoCount: number;
    videoId?: string;
}

interface CollectionListRes {
    total: number;
    rows: CollectionItem[];
}

export {
    CollectionOptionsRes,
    CollectionOption,
    CreateCollectionParams,
    CancelCollectionParams,
    CollectionListParams,
    CollectionItem,
    CollectionListRes
};
