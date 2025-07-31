import React, { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import artplayerPluginHlsQuality from 'artplayer-plugin-hls-quality';
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku';
import { cn } from '@/lib/utils';
import type { DanmakuItem } from '@/types';

interface PlayerProps {
    url: string;
    time?: number;
    className?: string;
    emitter?: boolean;
    danmaku: DanmakuItem[];
    isSeekHistory: boolean;
    onDanmuEmit?: (danmu: DanmakuItem) => boolean | Promise<boolean>;
    onIncrementPlay?: () => void;
    onHistoryEmit?: (time: number) => void;
}

const playVideo = (video: HTMLVideoElement, url: string, art: Artplayer) => {
    if (url.includes('.m3u8')) {
        if (Hls.isSupported()) {
            if (art.hls) art.hls.destroy();
            const hls = new Hls({ startLevel: 2 });
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.LEVEL_SWITCHED, () => {
                requestAnimationFrame(() => {
                    video.currentTime = Math.max(0, video.currentTime - 0.001);
                });
            });
            art.hls = hls;
            art.on('destroy', () => hls.destroy());
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
        } else {
            art.notice.show = '不支持 M3U8 视频';
        }
    } else {
        video.src = url;
    }
};

const Player: React.FC<PlayerProps> = ({
    url,
    time,
    className,
    emitter = false,
    danmaku,
    isSeekHistory,
    onDanmuEmit,
    onIncrementPlay,
    onHistoryEmit
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const artRef = useRef<Artplayer | null>(null);
    const lastTimeRef = useRef(0);

    useEffect(() => {
        if (!ref.current || artRef.current) return;

        const art = new Artplayer({
            url,
            autoplay: true,
            autoSize: false,
            autoMini: false,
            loop: false,
            quality: [],
            playbackRate: true,
            fullscreen: true,
            fullscreenWeb: false,
            autoOrientation: true,
            aspectRatio: false,
            autoPlayback: false,
            setting: false,
            screenshot: false,
            miniProgressBar: true,
            hotkey: true,
            pip: false,
            airplay: false,
            lock: true,
            isLive: false,
            fastForward: true,
            container: ref.current!,
            icons: {
                loading: '<img style="width: 150px;" src="/loading.gif">',
                state: '<img style="width: 80px;" src="/state.svg">'
            },
            customType: {
                m3u8: playVideo
            },
            theme: 'var(--primary)',
            plugins: [
                artplayerPluginHlsQuality({
                    control: true,
                    setting: false,
                    getResolution: level => level.height + 'p',
                    title: '画质'
                }),
                artplayerPluginDanmuku({
                    width: 644,
                    emitter,
                    danmuku: () => {
                        return new Promise(resovle => {
                            return resovle(danmaku);
                        });
                    },
                    beforeEmit: onDanmuEmit
                })
            ]
        });

        const seekTime = () => {
            if (time) {
                art.seek = time;
            }
        };

        const saveTime = () => {
            lastTimeRef.current = art.currentTime;
        };

        art.on('ready', seekTime);

        art.on('video:timeupdate', saveTime);

        artRef.current = art;

        return () => {
            art.off('ready', seekTime);
            art.off('video:timeupdate', saveTime);
            art.destroy(false);
            artRef.current = null;
        };
    }, []);

    // url 变化时切换视频源
    useEffect(() => {
        const art = artRef.current;
        if (art && art.url !== url) {
            art.switchUrl(url);
        }
    }, [url]);

    useEffect(() => {
        const art = artRef.current;
        if (!art) return;

        const seekTime = () => {
            if (time && isSeekHistory) {
                art.seek = time;
            }
        };

        art.on('restart', seekTime);

        return () => {
            art.off('restart', seekTime);
        };
    }, [time, isSeekHistory]);

    useEffect(() => {
        const art = artRef.current;
        if (!art) return;

        const handleTimeUpdate = () => {
            // 只在播放状态下累加
            if (!art.playing) return;
            onIncrementPlay?.();
            art.off('video:timeupdate', handleTimeUpdate);
        };

        art.on('video:timeupdate', handleTimeUpdate);

        // 卸载时移除监听
        return () => {
            art.off('video:timeupdate', handleTimeUpdate);
        };
    }, [onIncrementPlay, url]);

    useEffect(() => {
        const save = () => {
            onHistoryEmit?.(lastTimeRef.current);
        };

        window.addEventListener('beforeunload', save);

        return () => {
            window.removeEventListener('beforeunload', save);
            save();
        };
    }, [onHistoryEmit]);

    useEffect(() => {
        const art = artRef.current;
        if (art && art.plugins?.artplayerPluginDanmuku) {
            art.plugins.artplayerPluginDanmuku.config({
                danmuku: danmaku,
                emitter
            });
            art.plugins.artplayerPluginDanmuku.load();
        }
    }, [danmaku, emitter]);

    return (
        <div
            ref={ref}
            className={cn(
                'w-full aspect-video mb-12 md:mb-0 md:aspect-auto md:h-[calc(100%-3rem)] lg:h-full',
                className
            )}
        ></div>
    );
};

export default Player;
