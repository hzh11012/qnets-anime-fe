import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { AnimeState, AnimeAction } from '@/types';
import {
    getAnimeDetail,
    getAnimeRecommend,
    getDanmakuList,
    getAnimeSeries,
    createCollection,
    cancelCollection,
    createRating,
    incrementPlayCount,
    saveHistory
} from '@/apis';

const useAnimeStore = create<AnimeState & AnimeAction>()(
    devtools(
        immer((set, get) => ({
            initialLoading: false,
            detail: null,
            danmakus: [],

            animeLoading: false,
            recommendations: [],
            series: [],

            collectLoading: false,
            ratingLoading: false,

            fetchDetailData: async id => {
                set({ initialLoading: true });
                try {
                    const [detail, danmakus] = await Promise.all([
                        getAnimeDetail({ id }),
                        getDanmakuList({ id })
                    ]);

                    set({
                        detail: detail.data,
                        danmakus: danmakus.data.rows,
                        initialLoading: false
                    });
                } catch (error) {
                    set({ initialLoading: false });
                }
            },

            fetchAnimeData: async id => {
                set({ animeLoading: true });
                try {
                    const [recommendations, series] = await Promise.all([
                        getAnimeRecommend({ id }),
                        getAnimeSeries({ id })
                    ]);

                    set({
                        recommendations: recommendations.data.rows,
                        series: series.data.rows,
                        animeLoading: false
                    });
                } catch (error) {
                    set({ animeLoading: false });
                }
            },

            fetchCollect: async id => {
                const { detail } = get();
                const isCollected = !!detail?.isCollected;

                set({ collectLoading: true });
                try {
                    let data = null;
                    if (isCollected) {
                        data = await cancelCollection({ id });
                    } else {
                        data = await createCollection({ id });
                    }

                    if (data?.code === 200) {
                        set(state => {
                            state.detail!.isCollected = !isCollected;
                            state.collectLoading = false;
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

                        set(state => {
                            state.detail!.isRating = true;
                            state.ratingLoading = false;
                        });
                    } else {
                        set({ ratingLoading: false });
                    }
                } catch (error) {
                    set({ ratingLoading: false });
                }
            },

            incrementPlayCount: async id => {
                try {
                    await incrementPlayCount({ id });
                } catch (error) {}
            },

            saveHistory: async ({ id, animeId, time }) => {
                try {
                    await saveHistory({ id, animeId, time });
                } catch (error) {}
            }
        }))
    )
);

export { useAnimeStore };
