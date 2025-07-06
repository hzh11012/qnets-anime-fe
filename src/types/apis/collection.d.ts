interface CollectionOption {
    videoId: string;
    name: string;
    time: number;
    bannerUrl: string;
    status: number;
    videoCount: string;
    episode: string;
}

interface CollectionOptionsRes {
    total: number;
    rows: CollectionOption[];
}

export { CollectionOptionsRes, CollectionOption };
