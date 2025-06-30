import React, { useCallback, useMemo } from 'react';
import Swiper from '@/pages/home/swiper';
import { useRequest } from 'ahooks';
import { getBannerOptions } from '@/apis/banner';
import { useHomeStore, useUserStore } from '@/store';
import { cn, getResponsiveClasses } from '@/lib/utils';
import { getAnimeOptions } from '@/apis/anime';
import { useNavigate } from 'react-router-dom';
import AnimeType from '@/pages/home/anime-type';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimeCardSkeleton } from '@/components/custom/anime-card';
import { getTopicOptions } from '@/apis/topic';
import AnimeTopic from './anime-topic';

const ANIME_TYPES_MAP: Record<number, string> = {
    0: '剧场版推荐',
    1: '日漫推荐',
    2: '美漫推荐',
    3: '国创推荐',
    4: '里番推荐'
} as const;

const ALL_ANIME_TYPES = Object.keys(ANIME_TYPES_MAP);
const NORMAL_ANIME_TYPES = ALL_ANIME_TYPES.slice(0, 4);

const HomeSkeleton: React.FC = () => {
    const baseContainerClasses = cn('mt-4 md:mt-8', 'transition-[margin]');

    const gridContainerClasses = cn(
        baseContainerClasses,
        'gap-4 text-sm',
        'md:flex md:items-center md:gap-6',
        '[&>*:nth-last-child(1)]:max-md:hidden'
    );

    const renderAnimeCards = (count: number, type: 'vertical' | 'horizontal') =>
        [...Array(count)].map((_, index) => (
            <AnimeCardSkeleton
                type={type}
                key={index}
                className={getResponsiveClasses(index, type)}
            />
        ));

    return (
        <>
            <Skeleton
                className={cn(
                    baseContainerClasses,
                    'relative aspect-[16/9] w-full max-h-[600px]'
                )}
            />
            <div className={cn(gridContainerClasses, 'grid grid-cols-2')}>
                {renderAnimeCards(5, 'horizontal')}
            </div>
            {[...Array(3)].map((_, index) => (
                <div
                    key={index}
                    className={cn(gridContainerClasses, 'grid grid-cols-3')}
                >
                    {renderAnimeCards(7, 'vertical')}
                </div>
            ))}
        </>
    );
};

const Home: React.FC = () => {
    const navigate = useNavigate();

    const loading = useHomeStore(state => state.loading);
    const setLoading = useHomeStore(state => state.setLoading);
    const bannerList = useHomeStore(state => state.bannerList);
    const setBannerList = useHomeStore(state => state.setBannerList);
    const animeTypeList = useHomeStore(state => state.animeTypeList);
    const setAnimeTypeList = useHomeStore(state => state.setAnimeTypeList);
    const topicList = useHomeStore(state => state.topicList);
    const setTopicList = useHomeStore(state => state.setTopicList);

    const isHentai = useUserStore(state => state.isHentai);

    const ANIME_TYPES = useMemo(
        () => (isHentai ? ALL_ANIME_TYPES : NORMAL_ANIME_TYPES),
        [isHentai]
    );

    const initData = useCallback(async () => {
        const [bannerData, topicData, ...animeTypeList] = await Promise.all([
            getBannerOptions(),
            getTopicOptions(),
            ...ANIME_TYPES.map(type => getAnimeOptions({ type }))
        ]);

        return {
            bannerList: bannerData.data.rows,
            topicList: topicData.data.rows,
            animeTypeList: animeTypeList.map(item => item.data.rows)
        };
    }, [ANIME_TYPES]);

    useRequest(initData, {
        debounceWait: 250,
        onSuccess: data => {
            const { bannerList, topicList, animeTypeList } = data;
            setBannerList(bannerList);
            setTopicList(topicList);
            setAnimeTypeList(animeTypeList);
        },
        onFinally: () => setLoading(false)
    });

    const handleAnimeClick = useCallback((id: string) => {
        navigate(`anime/${id}`);
    }, []);

    const handleTopicClick = useCallback((id: string) => {
        navigate(`topic/${id}`);
    }, []);

    const handleAllClick = useCallback((type: number) => {
        navigate(`search?type=${type}`);
    }, []);

    const handleTopicAllClick = useCallback(() => {
        navigate('topic');
    }, []);

    const renderAnimeTypes = useMemo(
        () =>
            ANIME_TYPES.map((type, index) => (
                <AnimeType
                    key={type}
                    title={ANIME_TYPES_MAP[index]}
                    list={animeTypeList[index]}
                    onAnimeClick={handleAnimeClick}
                    onAllClick={() => handleAllClick(index)}
                />
            )),
        [ANIME_TYPES, animeTypeList, handleAnimeClick, handleAllClick]
    );

    if (loading) return <HomeSkeleton />;

    return (
        <div
            className={cn(
                'flex flex-col gap-4 md:gap-8 my-4 md:my-8',
                'transition-[margin]'
            )}
        >
            <Swiper list={bannerList} onClick={handleAnimeClick} />

            {renderAnimeTypes}

            <AnimeTopic
                title="专题推荐"
                list={topicList}
                onTopicClick={handleTopicClick}
                onAllClick={() => handleTopicAllClick()}
            />
        </div>
    );
};

export default Home;
