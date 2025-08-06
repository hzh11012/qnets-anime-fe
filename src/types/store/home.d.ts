import type {
    AnimeOption,
    BannerOption,
    CollectionOption,
    TopicOption,
    AnimeYouLike
} from '@/types';

interface HomeState {
    initialLoading: boolean;
    banners: BannerOption[];
    animeTypes: AnimeOption[][];
    topics: TopicOption[];
    collections: CollectionOption[];
    likes: {
        list: AnimeYouLike[];
        page: number;
        pageSize: number;
        total: number;
        loading: boolean;
        hasMore: boolean;
    };
}

interface HomeAction {
    fetchData: (types: string[]) => Promise<void>;
    loadMore: () => Promise<void>;
    reset: () => void;
}

export { HomeState, HomeAction };
