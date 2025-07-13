interface BannerOption {
    id: string;
    name: string;
    bannerUrl: string;
    status: number;
    videoCount: number;
    videoId?: string;
}

interface BannerOptionsRes {
    total: number;
    rows: BannerOption[];
}

export { BannerOptionsRes, BannerOption };
