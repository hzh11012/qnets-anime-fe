import { create } from 'zustand';
import type { HomeState, HomeAction } from '@/types';

const useHomeStore = create<HomeState & HomeAction>(set => ({
    loading: false,
    bannerList: [],
    setLoading: value => {
        set(() => ({ loading: value }));
    },
    setBannerList: value => {
        set(() => ({ bannerList: value }));
    }
}));

export { useHomeStore };
