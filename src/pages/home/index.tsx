import React, { useCallback, useEffect, useMemo } from 'react';
import Swiper from '@/pages/home/swiper';
import { useRequest } from 'ahooks';
import {
    getTopicOptions,
    getAnimeOptions,
    getBannerOptions,
    getCollectionOptions,
    guessAnimeYouLike
} from '@/apis';
import { useHomeStore, useUserStore } from '@/store';
import { cn, getResponsiveClasses } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import AnimeType from '@/pages/home/anime-type';
import { Skeleton } from '@/components/ui/skeleton';
import { AnimeCardSkeleton } from '@/components/custom/anime-card';
import AnimeTopic from '@/pages/home/anime-topic';
import AnimeCollection from '@/pages/home/anime-collection';
import AnimeGuess from '@/pages/home/anime-guess';

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
    const collectionList = useHomeStore(state => state.collectionList);
    const setCollectionList = useHomeStore(state => state.setCollectionList);
    const guessList = useHomeStore(state => state.guessList);
    const setGuessList = useHomeStore(state => state.setGuessList);
    const guessPage = useHomeStore(state => state.guessPage);
    const setGuessPage = useHomeStore(state => state.setGuessPage);
    const guessTotal = useHomeStore(state => state.guessTotal);
    const setGuessTotal = useHomeStore(state => state.setGuessTotal);

    const isHentai = useUserStore(state => state.isHentai);

    const ANIME_TYPES = useMemo(
        () => (isHentai ? ALL_ANIME_TYPES : NORMAL_ANIME_TYPES),
        [isHentai]
    );

    const initData = useCallback(async () => {
        const [
            bannerData,
            topicData,
            CollectionData,
            guessData,
            ...animeTypeList
        ] = await Promise.all([
            getBannerOptions(),
            getTopicOptions(),
            getCollectionOptions(),
            guessAnimeYouLike({ page: guessPage, pageSize: 5 }),
            ...ANIME_TYPES.map(type => getAnimeOptions({ type }))
        ]);

        return {
            bannerList: bannerData.data.rows,
            topicList: topicData.data.rows,
            collectionList: CollectionData.data.rows,
            guessList: guessData.data.rows,
            guessTotal: guessData.data.total,
            animeTypeList: animeTypeList.map(item => item.data.rows)
        };
    }, [ANIME_TYPES]);

    useRequest(initData, {
        debounceWait: 250,
        onSuccess: data => {
            const {
                bannerList,
                topicList,
                collectionList,
                guessList,
                guessTotal,
                animeTypeList
            } = data;
            setBannerList(bannerList);
            setTopicList(topicList);
            setCollectionList(collectionList);
            setGuessList(guessList);
            setGuessTotal(guessTotal);
            setAnimeTypeList(animeTypeList);
        },
        onFinally: () => setLoading(false)
    });

    // 猜你喜欢下拉加载
    const {
        run,
        loading: loadingMore,
        cancel
    } = useRequest(guessAnimeYouLike, {
        manual: true,
        debounceWait: 250,
        onSuccess: data => {
            const { rows, total } = data.data;
            const result = guessList.concat(rows);
            setGuessTotal(total);
            setGuessList(result);
        }
    });

    useEffect(() => {
        return () => {
            setGuessPage(1);
            setGuessTotal(0);
            setGuessList([]);
            cancel();
        };
    }, [cancel]);

    const handleAnimeClick = useCallback((id: string) => {
        id && navigate(`anime/${id}`);
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

    const handleCollectionAllClick = useCallback(() => {
        navigate('mine');
    }, []);

    const handleLoadGuess = () => {
        run({ page: guessPage + 1, pageSize: 5 });
        setGuessPage(guessPage + 1);
    };

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

            <AnimeCollection
                title="我的追番"
                list={collectionList}
                onAnimeClick={handleAnimeClick}
                onAllClick={() => handleTopicAllClick()}
            />

            {renderAnimeTypes}

            <AnimeTopic
                title="专题推荐"
                list={topicList}
                onTopicClick={handleTopicClick}
                onAllClick={() => handleCollectionAllClick()}
            />

            <AnimeGuess
                title="猜你喜欢"
                loading={loadingMore}
                list={guessList}
                total={guessTotal}
                onLoad={handleLoadGuess}
                onAnimeClick={handleAnimeClick}
            />
        </div>
    );
};

export default Home;
