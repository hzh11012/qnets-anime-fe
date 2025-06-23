interface BannerListItem {
    id: string;
    name: string;
    bannerUrl: string;
    status: number;
    videoCount: number;
}

interface BannerListRes {
    total: number;
    rows: BannerListItem[];
}

export { BannerListRes, BannerListItem };
