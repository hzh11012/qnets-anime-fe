import React, { useMemo, useCallback } from 'react';
import { AnimeCard } from '@/components/custom/anime-card';
import { Button } from '@/components/ui/button';
import { cn, formatVideoTime, getResponsiveClasses } from '@/lib/utils';
import type { CollectionOption } from '@/types';
import { ChevronRight } from 'lucide-react';

interface AnimeCollectionProps {
    title: string;
    list: CollectionOption[];
    onAnimeClick: (id: string) => void;
    onAllClick: () => void;
    className?: string;
}

const AnimeCollection: React.FC<AnimeCollectionProps> = ({
    title,
    list,
    className,
    onAnimeClick,
    onAllClick
}) => {
    if (!list?.length) return null;

    const { maxCount, displayList } = useMemo(() => {
        const maxCount = 5;
        const displayList = list.slice(0, maxCount);
        return { maxCount, displayList };
    }, [list]);

    const handleAnimeClick = (id: string) => onAnimeClick(id);

    const handleAllClick = () => onAllClick();

    const getTip = useCallback((item: CollectionOption) => {
        const { videoCount, status } = item;

        if (!videoCount) return '即将开播';

        if (status === 1) {
            return `更新至第${videoCount}话`;
        } else if (status === 2) {
            return `全${videoCount}话`;
        }

        return '即将开播';
    }, []);

    const getRemark = useCallback((item: CollectionOption) => {
        const { episode, time } = item;

        if (!episode) return '尚未观看';
        const _time = formatVideoTime(time);
        return `看到第${episode}话 ${_time}`;
    }, []);

    return (
        <div
            className={cn(
                'select-none transition-[margin] duration-200',
                className
            )}
        >
            <div className={cn('flex items-center justify-between mb-4')}>
                <div className={cn('font-bold text-base')}>{title}</div>
                <Button
                    variant="outline"
                    className={cn('gap-1')}
                    onClick={handleAllClick}
                >
                    查看全部
                    <ChevronRight />
                </Button>
            </div>
            <div
                className={cn(
                    'grid gap-4 text-sm',
                    'md:flex md:items-center md:gap-6 grid-cols-2',
                    {
                        '[&>*:nth-last-child(1)]:max-md:hidden':
                            displayList?.length === maxCount
                    }
                )}
            >
                {displayList.map((item, index) => {
                    const { id, videoId = '', name, bannerUrl } = item;
                    const tip = getTip(item);
                    const remark = getRemark(item);

                    return (
                        <AnimeCard
                            key={id}
                            type="horizontal"
                            className={getResponsiveClasses(
                                index,
                                'horizontal'
                            )}
                            title={name}
                            tip={tip}
                            remark={remark}
                            image={bannerUrl}
                            onClick={() => handleAnimeClick(videoId)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default AnimeCollection;
