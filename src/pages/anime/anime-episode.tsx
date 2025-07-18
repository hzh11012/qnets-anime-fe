import React, { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import type { AnimeDetailRes } from '@/types';
import { AudioLines, ListEnd, ListStart } from 'lucide-react';

interface AnimeEpisodeProps {
    detail: AnimeDetailRes;
    className?: string;
    onSelectVideo: (id: string) => void;
}

const AnimeEpisode: React.FC<AnimeEpisodeProps> = ({
    detail,
    className,
    onSelectVideo
}) => {
    const { videoCount, video, videoList } = detail;

    const containerRef = useRef<HTMLDivElement | null>(null);
    // 当前选中集数
    const currentEpisodeRef = useRef<HTMLDivElement | null>(null);

    const [sort, setSort] = useState('asc');

    const list = useMemo(() => {
        if (!videoList) return [];

        // 升序
        if (sort === 'asc') {
            return [...videoList].sort((a, b) => a.episode - b.episode);
        }

        // 降序
        return [...videoList].sort((a, b) => b.episode - a.episode);
    }, [videoList, sort]);

    // 滚动到当前集数
    useEffect(() => {
        if (currentEpisodeRef.current && containerRef.current) {
            const container = containerRef.current;
            const item = currentEpisodeRef.current;
            // 计算item相对于container的偏移
            const itemRect = item.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();

            // 当前item在容器内的top（可视区域内的偏移）
            const offset = itemRect.top - containerRect.top;

            // 让item居中
            container.scrollTop +=
                offset - container.clientHeight / 2 + item.clientHeight / 2;
        }
    }, [video.url, sort]);

    const handleSelectVideo = (id: string) => {
        onSelectVideo(id);
    };

    const handleSort = () => {
        setSort(preSort => {
            if (preSort === 'asc') {
                return 'desc';
            }
            return 'asc';
        });
    };

    return (
        <div className={cn('bg-muted rounded-sm overflow-hidden', className)}>
            <div
                className={cn(
                    'relative flex items-center text-sm text-foreground gap-1 py-3 px-4'
                )}
            >
                选集
                <span className={cn('text-xs text-muted-foreground')}>
                    ({video.episode}/{videoCount})
                </span>
                <div
                    className={cn(
                        'absolute right-4 cursor-pointer',
                        'transition-colors hover:text-primary-foreground'
                    )}
                    onClick={handleSort}
                >
                    {sort === 'asc' && <ListEnd size={22} />}
                    {sort === 'desc' && <ListStart size={22} />}
                </div>
            </div>
            <div
                ref={containerRef}
                className={cn('max-h-[13.75rem] overflow-auto outline-none')}
            >
                {list.map(item => {
                    const isCurrent = item.episode === video.episode;
                    return (
                        <div
                            key={item.id}
                            ref={isCurrent ? currentEpisodeRef : undefined}
                            className={cn(
                                'flex items-center px-4 h-10 text-foreground text-sm cursor-pointer',
                                'transition-colors hover:bg-primary/20 hover:text-primary-foreground',
                                {
                                    'text-primary-foreground bg-primary/20':
                                        isCurrent
                                }
                            )}
                            title={item.title}
                            onClick={() => handleSelectVideo(item.id)}
                        >
                            {isCurrent && (
                                <AudioLines className={cn('mr-2')} size={14} />
                            )}
                            <span className={cn('line-clamp-1')}>
                                第{item.episode}话 {item.title}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default AnimeEpisode;
