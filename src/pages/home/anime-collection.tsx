import React, { useMemo, useCallback, memo } from 'react';
import { AnimeCard } from '@/components/custom/anime-card';
import { Button } from '@/components/ui/button';
import { cn, formatVideoTime, getResponsiveClasses } from '@/lib/utils';
import type { CollectionOption } from '@/types';
import { ChevronRight } from 'lucide-react';

interface AnimeCollectionHeaderProps {
    title: string;
    onClick: () => void;
}

const AnimeCollectionHeader: React.FC<AnimeCollectionHeaderProps> = memo(
    ({ title, onClick }) => {
        return (
            <div className={cn('flex items-center justify-between mb-4')}>
                <div className={cn('font-bold text-base leading-9')}>
                    {title}
                </div>
                <Button
                    variant="outline"
                    className={cn('gap-1')}
                    onClick={onClick}
                >
                    查看全部
                    <ChevronRight />
                </Button>
            </div>
        );
    }
);

AnimeCollectionHeader.displayName = 'AnimeCollectionHeader';

interface AnimeCollectionListProps {
    list: CollectionOption[];
    maxCount: number;
    getTip: (item: CollectionOption) => string;
    getRemark: (item: CollectionOption) => string;
    onAnimeClick: (id: string) => void;
}

const AnimeCollectionList: React.FC<AnimeCollectionListProps> = ({
    list,
    maxCount,
    getTip,
    getRemark,
    onAnimeClick
}) => {
    return (
        <div
            className={cn(
                'grid gap-4 text-sm',
                'md:flex md:items-center md:gap-6 grid-cols-2',
                {
                    '[&>*:nth-last-child(1)]:max-md:hidden':
                        list.length === maxCount
                }
            )}
        >
            {list.map((item, index) => {
                const { id, name, bannerUrl, videoId = '' } = item;
                const tip = getTip(item);
                const remark = getRemark(item);

                return (
                    <AnimeCard
                        key={id}
                        type="horizontal"
                        className={getResponsiveClasses(index, 'horizontal')}
                        title={name}
                        tip={tip}
                        remark={remark}
                        image={bannerUrl}
                        onClick={() => onAnimeClick(videoId)}
                    />
                );
            })}
        </div>
    );
};

AnimeCollectionList.displayName = 'AnimeCollectionList';

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
    if (!list.length) return null;

    const { maxCount, displayList } = useMemo(() => {
        const maxCount = 5;
        const displayList = list.slice(0, maxCount);
        return { maxCount, displayList };
    }, [list]);

    const handleAnimeClick = useCallback(
        (id: string) => {
            id && onAnimeClick(id);
        },
        [onAnimeClick]
    );

    const handleAllAnimeClick = useCallback(() => {
        onAllClick();
    }, [onAllClick]);

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
            <AnimeCollectionHeader
                title={title}
                onClick={handleAllAnimeClick}
            />
            <AnimeCollectionList
                list={displayList}
                maxCount={maxCount}
                getTip={getTip}
                getRemark={getRemark}
                onAnimeClick={handleAnimeClick}
            />
        </div>
    );
};

AnimeCollection.displayName = 'AnimeCollection';

export default AnimeCollection;
