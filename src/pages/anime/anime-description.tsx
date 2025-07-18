import React, { useCallback, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { AnimeDetailRes } from '@/types';
import { ChevronDown, Heart, PlayCircle } from 'lucide-react';
import { useDebounceFn } from 'ahooks';
import AnimeRating from '@/pages/anime/anime-rating';
import type { FormValues } from '@/pages/anime/anime-rating';

interface AnimeDescriptionProps {
    detail: AnimeDetailRes;
    collectLoading: boolean;
    onCollected: (isCollected: boolean) => void;
    ratingLoading: boolean;
    onRating: (values: FormValues, cb: () => void) => void;
    className?: string;
}

const AnimeDescription: React.FC<AnimeDescriptionProps> = ({
    detail,
    className,
    collectLoading,
    onCollected,
    ratingLoading,
    onRating
}) => {
    const [open, setOpen] = useState(false);

    const {
        anime,
        avgRating,
        rating = '',
        collectionCount,
        playCount,
        videoCount,
        isCollected
    } = detail;

    const { run: handleCollected } = useDebounceFn(
        () => onCollected(isCollected),
        { wait: 200 }
    );

    const getRemark = useCallback(
        ({ videoCount, status }: { videoCount: number; status: number }) => {
            if (!videoCount) return '即将开播';

            if (status === 1) {
                return `连载中，更新至第${videoCount}话`;
            } else if (status === 2) {
                return `已完结，全${videoCount}话`;
            }

            return '即将开播';
        },
        []
    );

    const handleRating = (values: FormValues, cb: () => void) => {
        onRating(values, cb);
    };

    return (
        <div className={cn('relative', className)}>
            <div className={'flex items-center justify-between leading-none'}>
                <div
                    className={cn('line-clamp-1 text-foreground text-base')}
                    title={anime.name}
                >
                    {anime.name}
                </div>
                <Button
                    variant={`${isCollected ? 'outline' : 'default'}`}
                    className={cn('w-22 h-8', {
                        'border-none': isCollected
                    })}
                    disabled={collectLoading}
                    onClick={handleCollected}
                >
                    <Heart />
                    {isCollected ? '已追番' : '追番'}
                </Button>
            </div>
            <div className={cn('text-xs leading-none')}>
                {getRemark({
                    videoCount,
                    status: anime.status
                })}
            </div>
            <div className={cn('flex items-center text-xs mt-1.5 gap-3')}>
                <div className={cn('flex items-center gap-1')}>
                    <PlayCircle size={12} />
                    <span>{playCount}</span>
                </div>
                <div className={cn('flex items-center gap-1')}>
                    <Heart size={12} />
                    <span>{collectionCount}</span>
                </div>
                {!rating ? (
                    <AnimeRating
                        onSubmit={handleRating}
                        loading={ratingLoading}
                    >
                        <div
                            className={cn('text-orange-400 md:cursor-pointer')}
                            title="动漫评分"
                        >
                            {avgRating ? `${avgRating}分` : '暂无评分'}
                        </div>
                    </AnimeRating>
                ) : (
                    <div className={cn('text-orange-400')}>
                        {avgRating ? `${avgRating}分` : '暂无评分'}
                    </div>
                )}
                <div
                    className={cn(
                        'absolute right-0 flex items-center gap-1 select-none cursor-pointer hover:text-primary-foreground'
                    )}
                    onClick={() => setOpen(!open)}
                >
                    {open ? '收起' : '展开'}
                    <ChevronDown
                        size={14}
                        data-open={open}
                        className={cn(
                            'transition-[rotate] data-[open=true]:rotate-180'
                        )}
                    />
                </div>
            </div>
            <div
                className={cn(
                    'line-clamp-2 text-xs mt-1.5 text-muted-foreground',
                    'data-[open=true]:line-clamp-none'
                )}
                data-open={open}
            >
                {anime.description}
            </div>
        </div>
    );
};

export default AnimeDescription;
