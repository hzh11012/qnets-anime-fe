import { create } from 'zustand';
import type { HomeState, HomeAction } from '@/types';

const useHomeStore = create<HomeState & HomeAction>(set => ({
    loading: true,
    bannerList: [],
    animeTypeList: [],
    topicList: [],
    collectionList: [],
    guessList: [],
    guessTotal: 0,
    guessPage: 1,
    setLoading: value => {
        set(() => ({ loading: value }));
    },
    setBannerList: value => {
        set(() => ({ bannerList: value }));
    },
    setAnimeTypeList: value => {
        set(() => ({ animeTypeList: value }));
    },
    setTopicList: value => {
        set(() => ({ topicList: value }));
    },
    setCollectionList: value => {
        set(() => ({ collectionList: value }));
    },
    setGuessList: value => {
        set(() => ({ guessList: value }));
    },
    setGuessPage: value => {
        set(() => ({ guessPage: value }));
    },
    setGuessTotal: value => {
        set(() => ({ guessTotal: value }));
    }
}));

export { useHomeStore };
