import {
    AnimeOption,
    BannerOption,
    CollectionOption,
    TopicOption,
    AnimeYouLike
} from '@/types';

interface HomeState {
    loading: boolean;
    bannerList: BannerOption[];
    animeTypeList: AnimeOption[][];
    topicList: TopicOption[];
    collectionList: CollectionOption[];
    guessList: AnimeYouLike[];
    guessPage: number;
    guessTotal: number;
}

interface HomeAction {
    setLoading: (value: HomeState['loading']) => void;
    setBannerList: (value: HomeState['bannerList']) => void;
    setAnimeTypeList: (value: HomeState['animeTypeList']) => void;
    setTopicList: (value: HomeState['topicList']) => void;
    setCollectionList: (value: HomeState['collectionList']) => void;
    setGuessList: (value: HomeState['guessList']) => void;
    setGuessPage: (value: HomeState['guessPage']) => void;
    setGuessTotal: (value: HomeState['guessTotal']) => void;
}

export { HomeState, HomeAction };
