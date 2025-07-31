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

export {
    CollectionOptionsRes,
    CollectionOption,
    CreateCollectionParams,
    CancelCollectionParams
};
