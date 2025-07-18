interface DanmakuItem {
    text: string;
    time?: number;
    mode?: 0 | 1 | 2;
    color?: string;
}

interface DanmakuListRes {
    total: number;
    rows: DanmakuItem[];
}

interface DanmakuListParams {
    id: string;
}

interface DanmakuCreateParams {
    id: string;
    text: string;
    mode: 0 | 1 | 2;
    color: string;
    time: number;
}

export { DanmakuListRes, DanmakuItem, DanmakuListParams, DanmakuCreateParams };
