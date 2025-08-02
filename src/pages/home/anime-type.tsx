import React, { useMemo, useCallback } from 'react';
import { AnimeCard } from '@/components/custom/anime-card';
import { Button } from '@/components/ui/button';
import { cn, getResponsiveClasses } from '@/lib/utils';
import type { AnimeOption } from '@/types';
import { ChevronRight } from 'lucide-react';

interface AnimeTypeProps {
    type?: 'horizontal' | 'vertical';
    title: string;
    list: AnimeOption[];
    onAnimeClick: (id: string) => void;
    onAllClick: () => void;
    className?: string;
}

const AnimeType: React.FC<AnimeTypeProps> = ({
    type = 'vertical',
    title,
    list,
    className,
    onAnimeClick,
    onAllClick
}) => {
    if (!list?.length) return null;

    const { maxCount, displayList } = useMemo(() => {
        const maxCount = type === 'vertical' ? 7 : 5;
        const displayList = list.slice(0, maxCount);
        return { maxCount, displayList };
    }, [type, list]);

    const handleAnimeClick = (id: string) => onAnimeClick(id);

    const handleAllClick = () => onAllClick();

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
            <div className={cn('flex items-center justify-between mb-4')}>
                <div className={cn('font-bold text-base leading-9')}>{title}</div>
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
                    'md:flex md:items-center md:gap-6',
                    {
                        'grid-cols-3': type === 'vertical',
                        'grid-cols-2': type === 'horizontal'
                    },
                    {
                        '[&>*:nth-last-child(1)]:max-md:hidden':
                            displayList?.length === maxCount
                    }
                )}
            >
                {displayList.map((item, index) => {
                    const { id, name, coverUrl, remark, videoId = '' } = item;
                    const tip = getSubTitle(item);

                    return (
                        <AnimeCard
                            type={type}
                            key={id}
                            className={getResponsiveClasses(index, type)}
                            title={name}
                            remark={remark}
                            image={coverUrl}
                            tip={tip}
                            onClick={() => handleAnimeClick(videoId)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default AnimeType;
