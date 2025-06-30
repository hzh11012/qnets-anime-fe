import { AnimeOption, BannerOption, TopicOption } from '@/types';

interface HomeState {
    loading: boolean;
    bannerList: BannerOption[];
    animeTypeList: AnimeOption[][];
    topicList: TopicOption[];
}

interface HomeAction {
    setLoading: (value: HomeState['loading']) => void;
    setBannerList: (value: HomeState['bannerList']) => void;
    setAnimeTypeList: (value: HomeState['animeTypeList']) => void;
    setTopicList: (value: HomeState['topicList']) => void;
}

export { HomeState, HomeAction };
