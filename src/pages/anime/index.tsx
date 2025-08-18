import React, { memo, useCallback, useEffect, useState } from 'react';
import { danmakuCreate } from '@/apis';
import Player from '@/components/custom/player';
import {
    Sidebar,
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { DanmakuItem } from '@/types';
import { useNavigate } from 'react-router-dom';
import AnimeDescription from '@/pages/anime/anime-description';
import { useAnimeStore } from '@/store';
import { Separator } from '@radix-ui/react-separator';
import AnimeEpisode from '@/pages/anime/anime-episode';
import AnimeRecommend from '@/pages/anime/anime-recommend';
import AnimeSeries from '@/pages/anime/anime-series';
import {
    ChevronLeft,
    ChevronRight,
    EllipsisVertical,
    House,
    RefreshCcw
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { FormValues } from '@/pages/anime/anime-rating';
import VideoSkeleton from '@/components/custom/video-skeleton';

const SIDEBAR_WIDTH = '23.75rem';

interface AnimeDropdownMenuProps {
    className?: string;
}

const AnimeDropdownMenu: React.FC<AnimeDropdownMenuProps> = memo(
    ({ className }) => {
        const navigate = useNavigate();
        const handleGoHome = useCallback(() => navigate('/'), [navigate]);
        const handleReload = useCallback(() => navigate(0), [navigate]);

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <div
                        className={cn(
                            'absolute flex items-center justify-center rounded-sm size-8 top-2 right-5 text-foreground',
                            'transition-colors duration-200 hover:bg-accent md:cursor-pointer',
                            className
                        )}
                    >
                        <EllipsisVertical size={18} />
                    </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit" align="end">
                    <DropdownMenuItem
                        className={cn('text-foreground md:cursor-pointer')}
                        onClick={handleGoHome}
                    >
                        <House className={cn('text-foreground')} />
                        回到首页
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className={cn('text-foreground md:cursor-pointer')}
                        onClick={handleReload}
                    >
                        <RefreshCcw className={cn('text-foreground')} />
                        重新加载
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        );
    }
);

AnimeDropdownMenu.displayName = 'AnimeDropdownMenu';

// 自定义Hook：处理收藏和评分
const useInteractionHandlers = (detail: any) => {
    const fetchCollect = useAnimeStore(state => state.fetchCollect);
    const fetchRating = useAnimeStore(state => state.fetchRating);

    const handleCollected = useCallback(async () => {
        await fetchCollect(detail.video.animeId);
    }, [detail.video.animeId, fetchCollect]);

    const handleRating = useCallback(
        async (values: FormValues, cb: () => void) => {
            await fetchRating(detail.video.animeId, values, cb);
        },
        [detail.video.animeId, fetchRating]
    );

    return {
        handleCollected,
        handleRating
    };
};

// 自定义Hook：处理播放相关逻辑
const usePlayHandlers = (detail: any, navigate: any) => {
    const incrementPlayCount = useAnimeStore(state => state.incrementPlayCount);
    const saveHistory = useAnimeStore(state => state.saveHistory);

    const handleSelectVideo = useCallback(
        (id: string) => {
            id && navigate(`/anime/${id}`);
        },
        [navigate]
    );

    const handleIncrementPlay = useCallback(async () => {
        if (detail.video.id) {
            await incrementPlayCount(detail.video.id);
        }
    }, [detail.video.id, incrementPlayCount]);

    const handleHistoryEmit = useCallback(
        async (time: number) => {
            if (detail.video.id) {
                await saveHistory({
                    id: detail.video.id,
                    animeId: detail.video.animeId,
                    time
                });
            }
        },
        [detail.video.id, detail.video.animeId, saveHistory]
    );

    return {
        handleSelectVideo,
        handleIncrementPlay,
        handleHistoryEmit
    };
};

// 自定义Hook：处理弹幕发送
const useDanmakuEmit = (videoId: string) => {
    return useCallback(
        async (danmu: DanmakuItem): Promise<boolean> => {
            if (!videoId) return false;

            const { text, color, mode, time } = danmu;
            try {
                const data = await danmakuCreate({
                    id: videoId,
                    text,
                    color: color!,
                    mode: mode!,
                    time: time!
                });
                return data.code === 200;
            } catch (error) {
                return false;
            }
        },
        [videoId]
    );
};

// 自定义Hook：处理历史记录跳转逻辑
const useHistorySeek = (detail: any) => {
    const [currentAnimeId, setCurrentAnimeId] = useState('');
    const [currentVideoId, setCurrentVideoId] = useState('');
    const [isSeekHistory, setIsSeekHistory] = useState(false);

    useEffect(() => {
        const animeId = detail.video.animeId;
        const videoId = detail.video.id;

        // 判断是否为动漫切换（animeId变化）
        const isAnimeChanged =
            currentAnimeId !== '' && currentAnimeId !== animeId;
        // 判断是否为同动漫内集数切换（animeId相同但videoId不同）
        const isEpisodeChanged =
            currentAnimeId === animeId &&
            currentVideoId !== '' &&
            currentVideoId !== videoId;

        // 动漫切换时isSeekHistory为true，同动漫内集数切换时为false
        if (isAnimeChanged) {
            setIsSeekHistory(true);
        } else if (isEpisodeChanged) {
            setIsSeekHistory(false);
        }

        setCurrentAnimeId(animeId);
        setCurrentVideoId(videoId);
    }, [detail.video.animeId, detail.video.id, currentAnimeId, currentVideoId]);

    return isSeekHistory;
};

const useAnime = () => {
    const navigate = useNavigate();

    const detail = useAnimeStore(state => state.detail)!;
    const danmakus = useAnimeStore(state => state.danmakus);

    const animeLoading = useAnimeStore(state => state.animeLoading);
    const recommendations = useAnimeStore(state => state.recommendations);
    const series = useAnimeStore(state => state.series);

    const ratingLoading = useAnimeStore(state => state.ratingLoading);

    const fetchAnimeData = useAnimeStore(state => state.fetchAnimeData);

    const isSeekHistory = useHistorySeek(detail);
    const handleDanmuEmit = useDanmakuEmit(detail.video.id);
    const { handleSelectVideo, handleIncrementPlay, handleHistoryEmit } =
        usePlayHandlers(detail, navigate);
    const { handleCollected, handleRating } = useInteractionHandlers(detail);

    useEffect(() => {
        const animeId = detail.video.animeId;
        fetchAnimeData(animeId);
    }, [detail.video.animeId, fetchAnimeData]);

    return {
        detail,
        danmakus,
        animeLoading,
        recommendations,
        series,
        ratingLoading,
        isSeekHistory,
        handleDanmuEmit,
        handleSelectVideo,
        handleIncrementPlay,
        handleHistoryEmit,
        handleCollected,
        handleRating
    };
};

const Anime: React.FC = () => {
    const {
        detail,
        danmakus,
        animeLoading,
        recommendations,
        series,
        ratingLoading,
        isSeekHistory,
        handleDanmuEmit,
        handleSelectVideo,
        handleIncrementPlay,
        handleHistoryEmit,
        handleCollected,
        handleRating
    } = useAnime();

    return (
        <SidebarProvider
            style={{ '--sidebar-width': SIDEBAR_WIDTH } as React.CSSProperties}
            className={cn('group flex-col md:flex-row')}
        >
            <SidebarInset className={cn('bg-black flex-none md:flex-1')}>
                <Player
                    emitter={true}
                    url={detail.video.url}
                    time={detail.time}
                    danmaku={danmakus}
                    isSeekHistory={isSeekHistory}
                    onDanmuEmit={handleDanmuEmit}
                    onIncrementPlay={handleIncrementPlay}
                    onHistoryEmit={handleHistoryEmit}
                />
            </SidebarInset>
            <Sidebar
                wrapperClassName={cn('block')}
                className={cn(
                    'right-0 flex relative md:fixed w-full h-auto md:w-(--sidebar-width)'
                )}
                innerClassName={cn('bg-background')}
            >
                <SidebarTrigger
                    className={cn(
                        'absolute top-1/2 -translate-y-1/2 -translate-x-[100%] w-7 bg-black/50 h-14 rounded-tl-sm rounded-bl-sm',
                        'hidden md:group-hover:flex items-center justify-center cursor-pointer'
                    )}
                >
                    <ChevronRight
                        className={cn(
                            'text-white group-data-[state=collapsed]:hidden'
                        )}
                    />
                    <ChevronLeft
                        className={cn(
                            'text-white group-data-[state=expanded]:hidden'
                        )}
                    />
                </SidebarTrigger>
                <Tabs defaultValue="description" className={cn('size-full')}>
                    <TabsList
                        className={cn(
                            'min-h-[3.125rem] border-b-1 w-full justify-start'
                        )}
                    >
                        <TabsTrigger
                            className={cn(
                                'w-18 flex-none text-base after:inset-x-7'
                            )}
                            value="description"
                        >
                            简介
                        </TabsTrigger>
                        <TabsTrigger
                            className={cn(
                                'w-18 flex-none text-base after:inset-x-7'
                            )}
                            value="comment"
                        >
                            评论
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent
                        className={cn('py-5 md:overflow-auto')}
                        value="description"
                    >
                        <div className={cn('px-5')}>
                            <AnimeDescription
                                detail={detail!}
                                onCollected={handleCollected}
                                ratingLoading={ratingLoading}
                                onRating={handleRating}
                            />
                            <Separator
                                className={cn('my-5 h-[1px] bg-border')}
                            />
                            <AnimeEpisode
                                detail={detail!}
                                onSelectVideo={handleSelectVideo}
                            />
                            <Separator
                                className={cn('my-5 h-[1px] bg-border')}
                            />
                        </div>
                        {animeLoading ? (
                            <div
                                className={cn('flex flex-col flex-wrap gap-4')}
                            >
                                <VideoSkeleton />
                            </div>
                        ) : (
                            <>
                                <AnimeSeries
                                    title={`${detail.name}系列`}
                                    list={series}
                                    onAnimeClick={handleSelectVideo}
                                    className={cn('-my-2')}
                                />
                                {!!series.length && (
                                    <Separator
                                        className={cn('my-5 h-[1px] bg-border')}
                                    />
                                )}
                                <AnimeRecommend
                                    list={recommendations}
                                    onAnimeClick={handleSelectVideo}
                                    className={cn('-my-2')}
                                />
                            </>
                        )}
                    </TabsContent>
                    <TabsContent
                        className={cn('p-5 flex items-center justify-center')}
                        value="comment"
                    >
                        敬请期待
                    </TabsContent>
                </Tabs>

                <AnimeDropdownMenu
                    className={cn('md:group-data-[state=collapsed]:hidden')}
                />
            </Sidebar>
        </SidebarProvider>
    );
};

Anime.displayName = 'Anime';

export default Anime;
