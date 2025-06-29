interface AnimeOption {
    id: string;
    name: string;
    remark: string;
    coverUrl: string;
    status: number;
    videoCount: number;
}

interface AnimeOptionsRes {
    total: number;
    rows: AnimeOption[];
}

interface AnimeOptionsParams {
    type: string;
}

export { AnimeOptionsRes, AnimeOption, AnimeOptionsParams };
