import { create } from 'zustand';
import type { HomeState, HomeAction } from '@/types';

const useHomeStore = create<HomeState & HomeAction>(set => ({
    loading: true,
    bannerList: [],
    animeTypeList: [],
    topicList: [],
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
    }
}));

export { useHomeStore };
