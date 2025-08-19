import React, { memo, useCallback, useEffect, useMemo } from 'react';
import AnimeBanner from '@/pages/home/anime-banner';
import { useHomeStore, useUserStore } from '@/store';
import { cn, getResponsiveClasses } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import AnimeType from '@/pages/home/anime-type';
import { Skeleton } from '@/components/ui/skeleton';
import AnimeTopic from '@/pages/home/anime-topic';
import AnimeCollection from '@/pages/home/anime-collection';
import AnimeGuess from '@/pages/home/anime-guess';
import AnimeSkeleton from '@/components/custom/anime-skeleton';

const ANIME_TYPES_MAP: Record<number, string> = {
    0: '剧场版推荐',
    1: '日番推荐',
    2: '美漫推荐',
    3: '国创推荐',
    4: '里番推荐'
} as const;

const ALL_ANIME_TYPES = Object.keys(ANIME_TYPES_MAP);
const NORMAL_ANIME_TYPES = ALL_ANIME_TYPES.slice(0, 4);

const HomeSkeleton: React.FC = memo(() => {
    const baseContainerClasses = cn(
        'mt-4 md:mt-8',
        'transition-[margin] duration-200'
    );

    const gridContainerClasses = cn(
        baseContainerClasses,
        'gap-4 text-sm',
        'md:flex md:items-center md:gap-6',
        '[&>*:nth-last-child(1)]:max-md:hidden'
    );

    return (
        <>
            <Skeleton
                className={cn(
                    baseContainerClasses,
                    'relative aspect-[16/9] w-full max-h-[600px]'
                )}
            />
            <div className={cn(gridContainerClasses, 'grid grid-cols-2')}>
                <AnimeSkeleton
                    count={5}
                    type="horizontal"
                    className={getResponsiveClasses}
                />
            </div>
            {Array.from({ length: 3 }, (_, index) => (
                <div
                    key={index}
                    className={cn(gridContainerClasses, 'grid grid-cols-3')}
                >
                    <AnimeSkeleton
                        count={7}
                        type="vertical"
                        className={getResponsiveClasses}
                    />
                </div>
            ))}
        </>
    );
});

HomeSkeleton.displayName = 'HomeSkeleton';

const useHome = () => {
    const navigate = useNavigate();

    const initialLoading = useHomeStore(state => state.initialLoading);
    const banners = useHomeStore(state => state.banners);
    const collections = useHomeStore(state => state.collections);
    const topics = useHomeStore(state => state.topics);
    const animeTypes = useHomeStore(state => state.animeTypes);
    const likes = useHomeStore(state => state.likes);
    const fetchData = useHomeStore(state => state.fetchData);
    const loadMore = useHomeStore(state => state.loadMore);
    const reset = useHomeStore(state => state.reset);

    const isAllowViewHentai = useUserStore(state => state.isAllowViewHentai);
    const ANIME_TYPES = useMemo(
        () => (isAllowViewHentai ? ALL_ANIME_TYPES : NORMAL_ANIME_TYPES),
        [isAllowViewHentai]
    );

    useEffect(() => {
        fetchData(ANIME_TYPES);

        return () => {
            reset();
        };
    }, [ANIME_TYPES, fetchData, reset]);

    const handleAnimeClick = useCallback(
        (id: string) => {
            id && navigate(`/anime/${id}`);
        },
        [navigate]
    );

    const handleTopicClick = useCallback(
        (id: string) => {
            id && navigate(`/topic/${id}`);
        },
        [navigate]
    );

    const handleAllAnimeClick = useCallback(
        (type: number) => {
            navigate(`/bangumi?type=${type}`);
        },
        [navigate]
    );

    const handleAllTopicClick = useCallback(() => {
        navigate('/topic');
    }, [navigate]);

    const handleAllCollectionClick = useCallback(() => {
        navigate('/mine');
    }, [navigate]);

    const handleLoadMore = useCallback(() => {
        loadMore();
    }, [loadMore]);

    return {
        initialLoading,
        banners,
        collections,
        topics,
        animeTypes,
        ANIME_TYPES,
        likes,
        handleAnimeClick,
        handleAllAnimeClick,
        handleTopicClick,
        handleAllTopicClick,
        handleAllCollectionClick,
        handleLoadMore
    };
};

const Home: React.FC = () => {
    const {
        initialLoading,
        banners,
        collections,
        topics,
        animeTypes,
        ANIME_TYPES,
        likes,
        handleAnimeClick,
        handleAllAnimeClick,
        handleTopicClick,
        handleAllTopicClick,
        handleAllCollectionClick,
        handleLoadMore
    } = useHome();

    const renderAnimeTypes = useMemo(
        () =>
            ANIME_TYPES.map((type, index) => (
                <AnimeType
                    key={type}
                    title={ANIME_TYPES_MAP[index]}
                    list={animeTypes[index]}
                    onAnimeClick={handleAnimeClick}
                    onAllClick={() => handleAllAnimeClick(index)}
                />
            )),
        [ANIME_TYPES, animeTypes, handleAnimeClick, handleAllAnimeClick]
    );

    if (initialLoading) return <HomeSkeleton />;

    return (
        <div
            className={cn(
                'flex flex-col gap-4 md:gap-8 my-4 md:my-8',
                'transition-[margin] duration-200'
            )}
        >
            <AnimeBanner list={banners} onClick={handleAnimeClick} />

            <AnimeCollection
                title="我的追番"
                list={collections}
                onAnimeClick={handleAnimeClick}
                onAllClick={() => handleAllCollectionClick()}
            />

            {renderAnimeTypes}

            <AnimeTopic
                title="专题推荐"
                list={topics}
                onTopicClick={handleTopicClick}
                onAllClick={() => handleAllTopicClick()}
            />

            <AnimeGuess
                title="猜你喜欢"
                loading={likes.loading}
                list={likes.list}
                hasMore={likes.hasMore}
                onLoadMore={handleLoadMore}
                onAnimeClick={handleAnimeClick}
            />
        </div>
    );
};

Home.displayName = 'Home';

export default Home;
