import React, { useCallback, useEffect } from 'react';
import { danmakuCreate } from '@/apis';
import Player from '@/components/custom/player';
import {
    Sidebar,
    SidebarInset,
    SidebarProvider
} from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import type { DanmakuItem } from '@/types';
import { useNavigate, useParams } from 'react-router-dom';
import AnimeDescription from '@/pages/anime/anime-description';
import { useAnimeStore } from '@/store';
import { Separator } from '@radix-ui/react-separator';
import AnimeEpisode from '@/pages/anime/anime-episode';
import AnimeRecommend from '@/pages/anime/anime-recommend';
import AnimeSeries from '@/pages/anime/anime-series';
import { VideoCardSkeleton } from '@/components/custom/video-card';
import { EllipsisVertical, House, RefreshCcw } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { FormValues } from '@/pages/anime/anime-rating';

const SIDEBAR_WIDTH = '23.75rem';

const AnimeSkeleton: React.FC = () => {
    return (
        <div className={cn('flex flex-col flex-wrap gap-4')}>
            {[...Array(10)].map((_, index) => (
                <VideoCardSkeleton key={index} className={cn('px-5')} />
            ))}
        </div>
    );
};

const Anime: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const detail = useAnimeStore(state => state.animeDetail)!;
    const danmaku = useAnimeStore(state => state.animeDanmaku);
    const fetchAnimeData = useAnimeStore(state => state.fetchAnimeData);
    const animeLoading = useAnimeStore(state => state.animeLoading);
    const recommendList = useAnimeStore(state => state.animeRecommend);
    const seriesList = useAnimeStore(state => state.animeSeries);
    const fetchCollect = useAnimeStore(state => state.fetchCollect);
    const collectLoading = useAnimeStore(state => state.collectLoading);
    const fetchRating = useAnimeStore(state => state.fetchRating);
    const ratingLoading = useAnimeStore(state => state.ratingLoading);

    // 发送弹幕
    const handleDanmuEmit = async (danmu: DanmakuItem) => {
        if (!id) return false;
        const { text, color, mode, time } = danmu;
        const data = await danmakuCreate({
            id,
            text,
            color: color!,
            mode: mode!,
            time: time!
        });
        return data.code === 200;
    };

    // 选集跳转
    const handleSelectVideo = (id: string) => {
        id && navigate(`/anime/${id}`);
    };

    const handleCollected = useCallback(
        async (isCollected: boolean) => {
            await fetchCollect(detail.video.animeId, isCollected);
        },
        [detail.video.animeId]
    );

    const handleRating = useCallback(
        async (values: FormValues, cb: () => void) => {
            await fetchRating(detail.video.animeId, values, cb);
        },
        [detail.video.animeId]
    );

    useEffect(() => {
        const animeId = detail.video.animeId;
        fetchAnimeData(animeId);
    }, [detail.video.animeId]);

    return (
        <SidebarProvider
            style={{ '--sidebar-width': SIDEBAR_WIDTH } as React.CSSProperties}
            className={cn('flex-col md:flex-row')}
        >
            <SidebarInset className={cn('bg-black')}>
                <Player
                    emitter={true}
                    url={detail.video.url}
                    time={detail.time}
                    danmaku={danmaku}
                    onDanmuEmit={handleDanmuEmit}
                />
            </SidebarInset>
            <Sidebar
                wrapperClassName={cn('block')}
                className={cn(
                    'right-0 flex relative md:fixed w-full md:w-(--sidebar-width)'
                )}
                innerClassName={cn('bg-background')}
            >
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

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div
                                    className={cn(
                                        'absolute flex items-center justify-center rounded-sm size-8 right-6 text-foreground',
                                        'transition-colors hover:bg-accent md:cursor-pointer'
                                    )}
                                >
                                    <EllipsisVertical size={18} />
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-fit" align="end">
                                <DropdownMenuItem
                                    className={cn(
                                        'text-foreground md:cursor-pointer'
                                    )}
                                    onClick={() => navigate('/')}
                                >
                                    <House className={cn('text-foreground')} />
                                    回到首页
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className={cn(
                                        'text-foreground md:cursor-pointer'
                                    )}
                                    onClick={() => navigate(0)}
                                >
                                    <RefreshCcw
                                        className={cn('text-foreground')}
                                    />
                                    重新加载
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </TabsList>
                    <TabsContent
                        className={cn('py-5 md:overflow-auto')}
                        value="description"
                    >
                        <div className={cn('px-5')}>
                            <AnimeDescription
                                detail={detail!}
                                collectLoading={collectLoading}
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
                            <AnimeSkeleton />
                        ) : (
                            <>
                                <AnimeSeries
                                    title={`${detail.anime.name}系列`}
                                    list={seriesList}
                                    onAnimeClick={handleSelectVideo}
                                    className={cn('-my-2')}
                                />
                                {!!seriesList.length && (
                                    <Separator
                                        className={cn('my-5 h-[1px] bg-border')}
                                    />
                                )}
                                <AnimeRecommend
                                    list={recommendList}
                                    onAnimeClick={handleSelectVideo}
                                    className={cn('-my-2')}
                                />
                            </>
                        )}
                    </TabsContent>
                    <TabsContent className={cn('p-5')} value="comment">
                        {/* 评论区可后续实现 */}
                        暂无评论
                    </TabsContent>
                </Tabs>
            </Sidebar>
        </SidebarProvider>
    );
};

export default Anime;
