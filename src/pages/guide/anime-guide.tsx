import React, { useCallback, useMemo, useState } from 'react';
import { AnimeCard, AnimeCardSkeleton } from '@/components/custom/anime-card';
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

interface AnimeGuideProps {
    title: string;
    description?: string;
    list: AnimeGuideItem[];
    total: number;
    loading: boolean;
    defaultUpdateDay: string;
    onLoadMore: () => void;
    onUpdateDayChage: (updateDay: string) => void;
    onAnimeClick: (id: string) => void;
    className?: string;
}

const updateDays = [
    { label: '周一', value: '1' },
    { label: '周二', value: '2' },
    { label: '周三', value: '3' },
    { label: '周四', value: '4' },
    { label: '周五', value: '5' },
    { label: '周六', value: '6' },
    { label: '周日', value: '0' }
];

const AnimeGuideSkeleton: React.FC<{ count?: number }> = ({ count = 10 }) => (
    <>
        {[...Array(count)].map((_, index) => (
            <AnimeCardSkeleton type="vertical" key={index} />
        ))}
    </>
);

const AnimeGuide: React.FC<AnimeGuideProps> = ({
    title,
    list,
    total,
    defaultUpdateDay,
    className,
    loading,
    onLoadMore,
    onUpdateDayChage,
    onAnimeClick
}) => {
    const [day, setDay] = useState(defaultUpdateDay);
    const hasMore = useMemo(() => {
        return list.length < total;
    }, [list, total]);

    const { ref } = useInView({
        threshold: 0,
        onChange: inView => {
            if (inView && !loading && hasMore) {
                onLoadMore();
            }
        }
    });

    const handleAnimeClick = (id: string) => onAnimeClick(id);

    const { run: handleDayChange } = useDebounceFn(
        (day: string) => {
            setDay(day);
            onUpdateDayChage(day);
        },
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

    return (
        <div
            className={cn(
                'size-full select-none transition-[margin] duration-200',
                className
            )}
        >
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
                                    onClick={() => handleDayChange(value)}
                                >
                                    {label}
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>

                <Select value={day} onValueChange={handleDayChange}>
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

            {!list.length && !loading ? (
                <Exception type="empty" />
            ) : (
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
                        const {
                            id,
                            name,
                            remark,
                            coverUrl,
                            videoId = ''
                        } = item;
                        const tip = getSubTitle(item);

                        return (
                            <AnimeCard
                                key={id}
                                type="vertical"
                                title={name}
                                remark={remark}
                                tip={tip}
                                image={coverUrl}
                                onClick={() => handleAnimeClick(videoId)}
                            />
                        );
                    })}
                    {loading && <AnimeGuideSkeleton />}
                    {/* 触底加载的锚点 */}
                    <div
                        ref={hasMore ? ref : undefined}
                        style={{ height: 0 }}
                    />
                </div>
            )}
        </div>
    );
};

export default AnimeGuide;
