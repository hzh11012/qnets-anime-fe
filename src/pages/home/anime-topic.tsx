import React, { memo, useCallback, useMemo } from 'react';
import { AnimeCard } from '@/components/custom/anime-card';
import { Button } from '@/components/ui/button';
import { cn, getResponsiveClasses } from '@/lib/utils';
import type { TopicOption } from '@/types';
import { ChevronRight } from 'lucide-react';

interface AnimeTopicHeaderProps {
    title: string;
    onClick: () => void;
}

const AnimeTopicHeader: React.FC<AnimeTopicHeaderProps> = memo(
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

AnimeTopicHeader.displayName = 'AnimeTopicHeader';

interface AnimeTopicListProps {
    list: TopicOption[];
    maxCount: number;
    onTopicClick: (id: string) => void;
}

const AnimeTopicList: React.FC<AnimeTopicListProps> = ({
    list,
    maxCount,
    onTopicClick
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
                const { id, name, coverUrl, count } = item;
                const remark = `${count}个影片`;

                return (
                    <AnimeCard
                        key={id}
                        type="horizontal"
                        className={getResponsiveClasses(index, 'horizontal')}
                        title={name}
                        tip={remark}
                        image={coverUrl}
                        onClick={() => onTopicClick(id)}
                    />
                );
            })}
        </div>
    );
};

AnimeTopicList.displayName = 'AnimeTopicList';

interface AnimeTopicProps {
    title: string;
    list: TopicOption[];
    onTopicClick: (id: string) => void;
    onAllClick: () => void;
    className?: string;
}

const AnimeTopic: React.FC<AnimeTopicProps> = ({
    title,
    list,
    className,
    onTopicClick,
    onAllClick
}) => {
    if (!list?.length) return null;

    const { maxCount, displayList } = useMemo(() => {
        const maxCount = 5;
        const displayList = list.slice(0, maxCount);
        return { maxCount, displayList };
    }, [list]);

    const handleTopicClick = useCallback(
        (id: string) => {
            id && onTopicClick(id);
        },
        [onTopicClick]
    );

    const handleAllTopicClick = useCallback(() => {
        onAllClick();
    }, [onAllClick]);

    return (
        <div
            className={cn(
                'select-none transition-[margin] duration-200',
                className
            )}
        >
            <AnimeTopicHeader title={title} onClick={handleAllTopicClick} />
            <AnimeTopicList
                list={displayList}
                maxCount={maxCount}
                onTopicClick={handleTopicClick}
            />
        </div>
    );
};

AnimeTopic.displayName = 'AnimeTopic';

export default AnimeTopic;
