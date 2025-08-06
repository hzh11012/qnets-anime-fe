import React, { memo, useCallback, useMemo, useState } from 'react';
import { AnimeCard } from '@/components/custom/anime-card';
import { cn } from '@/lib/utils';
import type { AnimeGuideItem } from '@/types';
import { useInView } from 'react-intersection-observer';
import Exception from '@/components/custom/exception';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebounceFn } from 'ahooks';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import AnimeSkeleton from '@/components/custom/anime-skeleton';

const updateDays = [
    { label: '周一', value: '1' },
    { label: '周二', value: '2' },
    { label: '周三', value: '3' },
    { label: '周四', value: '4' },
    { label: '周五', value: '5' },
    { label: '周六', value: '6' },
    { label: '周日', value: '0' }
] as const;

interface AnimeGuideHeaderProps {
    title: string;
    day: string;
    onDayChange: (day: string) => void;
}

const AnimeGuideHeader: React.FC<AnimeGuideHeaderProps> = memo(
    ({ title, day, onDayChange }) => {
        return (
            <div className={cn('flex items-center justify-between mb-4')}>
                <div className={cn('font-bold text-base leading-9')}>
                    {title}
                </div>
                <Tabs value={day} className="items-center hidden md:flex">
                    <TabsList>
                        {updateDays.map(item => {
                            const { label, value } = item;
                            return (
                                <TabsTrigger
                                    key={value}
                                    value={value}
                                    className="data-[state=active]:after:hidden"
                                    onClick={() => onDayChange(value)}
                                >
                                    {label}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>

                <Select value={day} onValueChange={onDayChange}>
                    <SelectTrigger className={cn('w-20 flex md:hidden')}>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="min-w-20">
                        <SelectGroup>
                            {updateDays.map(item => {
                                const { label, value } = item;
                                return (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                );
                            })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        );
    }
);

AnimeGuideHeader.displayName = 'AnimeGuideHeader';

interface AnimeGuideListProps {
    ref: (node?: Element | null) => void;
    list: AnimeGuideItem[];
    loading: boolean;
    hasMore: boolean;
    getSubTitle: (item: AnimeGuideItem) => string;
    onAnimeClick: (id: string) => void;
}

const AnimeGuideList: React.FC<AnimeGuideListProps> = ({
    ref,
    list,
    loading,
    hasMore,
    getSubTitle,
    onAnimeClick
}) => {
    return (
        <div
            className={cn(
                'grid gap-4 grid-cols-7 text-sm',
                'md:gap-6',
                'max-[1500px]:grid-cols-6',
                'max-[1300px]:grid-cols-5',
                'max-[1100px]:grid-cols-4',
                'max-[855px]:grid-cols-3',
                'max-md:grid-cols-3'
            )}
        >
            {list.map(item => {
                const { id, name, remark, coverUrl, videoId = '' } = item;
                const tip = getSubTitle(item);

                return (
                    <AnimeCard
                        key={id}
                        type="vertical"
                        title={name}
                        remark={remark}
                        tip={tip}
                        image={coverUrl}
                        onClick={() => onAnimeClick(videoId)}
                    />
                );
            })}
            {loading && <AnimeSkeleton />}
            {/* 触底加载的锚点 */}
            {hasMore && <div ref={ref} style={{ height: 0 }} />}
        </div>
    );
};

AnimeGuideList.displayName = 'AnimeGuideList';

interface AnimeGuideProps {
    title: string;
    list: AnimeGuideItem[];
    loading: boolean;
    hasMore: boolean;
    defaultDay: string;
    onLoadMore: () => void;
    onDayChage: (updateDay: string) => void;
    onAnimeClick: (id: string) => void;
    className?: string;
}

const AnimeGuide: React.FC<AnimeGuideProps> = ({
    title,
    list,
    loading,
    hasMore,
    defaultDay,
    className,
    onLoadMore,
    onDayChage,
    onAnimeClick
}) => {
    const [day, setDay] = useState(defaultDay);

    const { ref } = useInView({
        threshold: 0,
        onChange: inView => {
            if (inView && !loading && hasMore) {
                onLoadMore();
            }
        }
    });

    const handleAnimeClick = useCallback(
        (id: string) => {
            id && onAnimeClick(id);
        },
        [onAnimeClick]
    );

    const { run: handleDayChange } = useDebounceFn(
        useCallback(
            (day: string) => {
                setDay(day);
                onDayChage(day);
            },
            [setDay, onDayChage]
        ),
        { wait: 200 }
    );

    const getSubTitle = useCallback((item: AnimeGuideItem) => {
        const { videoCount, status, updateTime } = item;

        if (!videoCount) return '即将开播';

        if (status === 1) {
            return `更新至第${videoCount}话 | ${updateTime}`;
        } else if (status === 2) {
            return `全${videoCount}话`;
        }

        return '即将开播';
    }, []);

    const isEmpty = useMemo(
        () => !list.length && !loading,
        [list.length, loading]
    );

    return (
        <div
            className={cn(
                'size-full select-none transition-[margin] duration-200',
                className
            )}
        >
            <AnimeGuideHeader
                title={title}
                day={day}
                onDayChange={handleDayChange}
            />

            {isEmpty ? (
                <Exception type="empty" />
            ) : (
                <AnimeGuideList
                    ref={ref}
                    list={list}
                    loading={loading}
                    hasMore={hasMore}
                    getSubTitle={getSubTitle}
                    onAnimeClick={handleAnimeClick}
                />
            )}
        </div>
    );
};

AnimeGuide.displayName = 'AnimeGuide';

export default AnimeGuide;
