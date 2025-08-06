import React, { useMemo, useCallback, memo } from 'react';
import { AnimeCard } from '@/components/custom/anime-card';
import { Button } from '@/components/ui/button';
import { cn, getResponsiveClasses } from '@/lib/utils';
import type { AnimeOption } from '@/types';
import { ChevronRight } from 'lucide-react';

interface AnimeTypeHeaderProps {
    title: string;
    onClick: () => void;
}

const AnimeTypeHeader: React.FC<AnimeTypeHeaderProps> = memo(
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

AnimeTypeHeader.displayName = 'AnimeTypeHeader';

interface AnimeTypeListProps {
    list: AnimeOption[];
    maxCount: number;
    getSubTitle: (item: AnimeOption) => string;
    onAnimeClick: (id: string) => void;
}

const AnimeTypeList: React.FC<AnimeTypeListProps> = ({
    list,
    maxCount,
    getSubTitle,
    onAnimeClick
}) => {
    return (
        <div
            className={cn(
                'grid gap-4 text-sm',
                'md:flex md:items-center md:gap-6 grid-cols-3',
                {
                    '[&>*:nth-last-child(1)]:max-md:hidden':
                        list.length === maxCount
                }
            )}
        >
            {list.map((item, index) => {
                const { id, name, coverUrl, remark, videoId = '' } = item;
                const tip = getSubTitle(item);

                return (
                    <AnimeCard
                        key={id}
                        className={getResponsiveClasses(index, 'vertical')}
                        title={name}
                        remark={remark}
                        image={coverUrl}
                        tip={tip}
                        onClick={() => onAnimeClick(videoId)}
                    />
                );
            })}
        </div>
    );
};

AnimeTypeList.displayName = 'AnimeTypeList';

interface AnimeTypeProps {
    title: string;
    list: AnimeOption[];
    onAnimeClick: (id: string) => void;
    onAllClick: () => void;
    className?: string;
}

const AnimeType: React.FC<AnimeTypeProps> = ({
    title,
    list,
    className,
    onAnimeClick,
    onAllClick
}) => {
    if (!list?.length) return null;

    const { maxCount, displayList } = useMemo(() => {
        const maxCount = 7;
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

    const getSubTitle = useCallback((item: AnimeOption) => {
        const { videoCount, status } = item;

        if (!videoCount) return '即将开播';

        if (status === 1) {
            return `更新至第${videoCount}话`;
        } else if (status === 2) {
            return `全${videoCount}话`;
        }

        return '即将开播';
    }, []);

    return (
        <div
            className={cn(
                'select-none transition-[margin] duration-200',
                className
            )}
        >
            <AnimeTypeHeader title={title} onClick={handleAllAnimeClick} />
            <AnimeTypeList
                list={displayList}
                maxCount={maxCount}
                getSubTitle={getSubTitle}
                onAnimeClick={handleAnimeClick}
            />
        </div>
    );
};

AnimeType.displayName = 'AnimeType';

export default AnimeType;
