import { create } from 'zustand';
import type { AnimeState, AnimeAction } from '@/types';
import {
    getAnimeDetail,
    getAnimeRecommend,
    getDanmakuList,
    getAnimeSeries,
    createCollection,
    cancelCollection,
    createRating
} from '@/apis';

const useAnimeStore = create<AnimeState & AnimeAction>((set, get) => ({
    initialLoading: true,
    animeDetail: null,
    animeDanmaku: [],
    animeLoading: true,
    animeRecommend: [],
    animeSeries: [],
    collectLoading: false,
    ratingLoading: false,
    fetchAnimeDetailData: async id => {
        set({ initialLoading: true });
        try {
            const [animeDetail, animeDanmaku] = await Promise.all([
                getAnimeDetail({ id }),
                getDanmakuList({ id })
            ]);

            set({
                animeDetail: animeDetail.data,
                animeDanmaku: animeDanmaku.data.rows,
                initialLoading: false
            });
        } catch (error) {
            set({ initialLoading: false });
        }
    },
    fetchAnimeData: async id => {
        set({ animeLoading: true });
        try {
            const [animeRecommend, animeSeries] = await Promise.all([
                getAnimeRecommend({ id }),
                getAnimeSeries({ id })
            ]);

            set({
                animeRecommend: animeRecommend.data.rows,
                animeSeries: animeSeries.data.rows,
                animeLoading: false
            });
        } catch (error) {
            set({ animeLoading: false });
        }
    },
    fetchCollect: async (id, isCollected) => {
        set({ collectLoading: true });
        try {
            let data = null;
            if (isCollected) {
                data = await cancelCollection({ id });
            } else {
                data = await createCollection({ id });
            }

            if (data?.code === 200) {
                const state = get();
                set({
                    collectLoading: false,
                    animeDetail: state.animeDetail
                        ? {
                              ...state.animeDetail,
                              isCollected: !isCollected
                          }
                        : null
                });
            } else {
                set({ collectLoading: false });
            }
        } catch (error) {
            set({ collectLoading: false });
        }
    },
    fetchRating: async (id, data, cb) => {
        set({ ratingLoading: true });
        try {
            const res = await createRating({ id, ...data });
            if (res?.code === 200) {
                cb();
                const state = get();
                set({
                    ratingLoading: false,
                    animeDetail: state.animeDetail
                        ? {
                              ...state.animeDetail,
                              rating: Number(data.score)
                          }
                        : null
                });
            } else {
                set({ ratingLoading: false });
            }
        } catch (error) {
            set({ ratingLoading: false });
        }
    }
}));

export { useAnimeStore };
