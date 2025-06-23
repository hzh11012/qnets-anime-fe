import { BannerListItem } from '@/types';

interface HomeState {
    loading: boolean;
    bannerList: BannerListItem[];
}

interface HomeAction {
    setLoading: (value: HomeState['loading']) => void;
    setBannerList: (value: HomeState['bannerList']) => void;
}

export { HomeState, HomeAction };
