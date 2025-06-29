import { AnimeOption, BannerOption } from '@/types';

interface HomeState {
    loading: boolean;
    bannerList: BannerOption[];
    animeTypeList: AnimeOption[][];
}

interface HomeAction {
    setLoading: (value: HomeState['loading']) => void;
    setBannerList: (value: HomeState['bannerList']) => void;
    setAnimeTypeList: (value: HomeState['animeTypeList']) => void;
}

export { HomeState, HomeAction };
