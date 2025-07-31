import React, { useCallback } from 'react';
import { cn } from '@/lib/utils';
import type { AnimeSeriesItem } from '@/types';
import { VideoCard } from '@/components/custom/video-card';

interface AnimeSeriesProps {
    title: string;
    list: AnimeSeriesItem[];
    onAnimeClick: (id: string) => void;
    className?: string;
}

const AnimeSeries: React.FC<AnimeSeriesProps> = ({
    title,
    list,
    className,
    onAnimeClick
}) => {
    if (!list?.length) return null;

    const handleAnimeClick = (id: string) => onAnimeClick(id);

    const getRemark = useCallback((item: AnimeSeriesItem) => {
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
        <div className={cn('select-none', className)}>
            <div className={cn('px-5 text-foreground my-1.5')}>{title}</div>
            <div className={cn('flex flex-col flex-wrap')}>
                {list.map(item => {
                    const {
                        id,
                        name,
                        bannerUrl,
                        playCount,
                        collectionCount,
                        videoId = ''
                    } = item;

                    const remark = getRemark(item);
                    return (
                        <VideoCard
                            key={id}
                            className={cn(
                                'w-full px-5 py-2 transition-colors duration-200 hover:bg-accent/65'
                            )}
                            title={name}
                            image={bannerUrl}
                            plays={playCount}
                            collections={collectionCount}
                            remark={remark}
                            onClick={() => handleAnimeClick(videoId)}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default AnimeSeries;
