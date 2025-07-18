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
    recommended: {
        list: AnimeYouLike[];
        page: number;
        pageSize: number;
        total: number;
        loading: boolean;
    };
}

interface HomeAction {
    fetchHomeData: (types: string[]) => Promise<void>;
    loadMore: () => Promise<void>;
}

export { HomeState, HomeAction };
