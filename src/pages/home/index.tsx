import React, { useEffect, useMemo } from 'react';
import AnimeBanner from '@/pages/home/anime-banner';
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
    1: '日番推荐',
    2: '美漫推荐',
    3: '国创推荐',
    4: '里番推荐'
} as const;

const ALL_ANIME_TYPES = Object.keys(ANIME_TYPES_MAP);
const NORMAL_ANIME_TYPES = ALL_ANIME_TYPES.slice(0, 4);

const HomeSkeleton: React.FC = () => {
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

    const initialLoading = useHomeStore(state => state.initialLoading);
    const fetchHomeData = useHomeStore(state => state.fetchHomeData);
    const banners = useHomeStore(state => state.banners);
    const collections = useHomeStore(state => state.collections);
    const topics = useHomeStore(state => state.topics);
    const animeTypes = useHomeStore(state => state.animeTypes);

    const recommended = useHomeStore(state => state.recommended);
    const loadMore = useHomeStore(state => state.loadMore);

    const isAllowViewHentai = useUserStore(state => state.isAllowViewHentai);
    const ANIME_TYPES = useMemo(
        () => (isAllowViewHentai ? ALL_ANIME_TYPES : NORMAL_ANIME_TYPES),
        [isAllowViewHentai]
    );

    useEffect(() => {
        fetchHomeData(ANIME_TYPES);
    }, [ANIME_TYPES]);

    const handleAnimeClick = (id: string) => {
        id && navigate(`anime/${id}`);
    };

    const handleTopicClick = (id: string) => {
        navigate(`topic/${id}`);
    };

    const handleAllClick = (type: number) => {
        navigate(`bangumi?type=${type}`);
    };

    const handleTopicAllClick = () => {
        navigate('topic');
    };

    const handleCollectionAllClick = () => {
        navigate('mine');
    };

    const renderAnimeTypes = useMemo(
        () =>
            ANIME_TYPES.map((type, index) => (
                <AnimeType
                    key={type}
                    title={ANIME_TYPES_MAP[index]}
                    list={animeTypes[index]}
                    onAnimeClick={handleAnimeClick}
                    onAllClick={() => handleAllClick(index)}
                />
            )),
        [ANIME_TYPES, animeTypes]
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
                onAllClick={() => handleCollectionAllClick()}
            />

            {renderAnimeTypes}

            <AnimeTopic
                title="专题推荐"
                list={topics}
                onTopicClick={handleTopicClick}
                onAllClick={() => handleTopicAllClick()}
            />

            <AnimeGuess
                title="猜你喜欢"
                loading={recommended.loading}
                list={recommended.list}
                total={recommended.total}
                onLoadMore={loadMore}
                onAnimeClick={handleAnimeClick}
            />
        </div>
    );
};

export default Home;
