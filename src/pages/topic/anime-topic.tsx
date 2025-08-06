import React, { memo, useCallback, useMemo } from 'react';
import { AnimeCard } from '@/components/custom/anime-card';
import { cn } from '@/lib/utils';
import type { TopicOption } from '@/types';
import { useInView } from 'react-intersection-observer';
import Exception from '@/components/custom/exception';
import AnimeSkeleton from '@/components/custom/anime-skeleton';

interface AnimeTopicHeaderProps {
    title: string;
}

const AnimeTopicHeader: React.FC<AnimeTopicHeaderProps> = memo(({ title }) => {
    return (
        <div className={cn('flex items-center mb-4')}>
            <div className={cn('font-bold text-base leading-9')}>{title}</div>
        </div>
    );
});

AnimeTopicHeader.displayName = 'AnimeTopicHeader';

interface AnimeTopicListProps {
    ref: (node?: Element | null) => void;
    list: TopicOption[];
    loading: boolean;
    hasMore: boolean;
    onTopicClick: (id: string) => void;
}

const AnimeTopicList: React.FC<AnimeTopicListProps> = ({
    ref,
    list,
    loading,
    hasMore,
    onTopicClick
}) => {
    return (
        <div
            className={cn(
                'grid gap-4 grid-cols-5 text-sm',
                'md:gap-6',
                'max-[1500px]:grid-cols-4',
                'max-[1140px]:grid-cols-3',
                'max-[855px]:grid-cols-2',
                'max-md:grid-cols-2'
            )}
        >
            {list.map(item => {
                const { id, name, coverUrl, count } = item;
                const tip = `${count}个动漫`;

                return (
                    <AnimeCard
                        key={id}
                        type="horizontal"
                        title={name}
                        tip={tip}
                        image={coverUrl}
                        onClick={() => onTopicClick(id)}
                    />
                );
            })}
            {loading && <AnimeSkeleton type="horizontal" />}
            {/* 触底加载的锚点 */}
            {hasMore && <div ref={ref} style={{ height: 0 }} />}
        </div>
    );
};

AnimeTopicList.displayName = 'AnimeTopicList';

interface AnimeTopicProps extends AnimeTopicHeaderProps {
    list: TopicOption[];
    loading: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
    onTopicClick: (id: string) => void;
    className?: string;
}

const AnimeTopic: React.FC<AnimeTopicProps> = ({
    title,
    list,
    hasMore,
    className,
    loading,
    onLoadMore,
    onTopicClick
}) => {
    const { ref } = useInView({
        threshold: 0,
        onChange: inView => {
            if (inView && !loading && hasMore) {
                onLoadMore();
            }
        }
    });

    const handleTopicClick = useCallback(
        (id: string) => {
            onTopicClick(id);
        },
        [onTopicClick]
    );

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
            <AnimeTopicHeader title={title} />
            {isEmpty ? (
                <Exception type="empty" />
            ) : (
                <AnimeTopicList
                    ref={ref}
                    list={list}
                    loading={loading}
                    hasMore={hasMore}
                    onTopicClick={handleTopicClick}
                />
            )}
        </div>
    );
};

AnimeTopic.displayName = 'AnimeTopic';

export default AnimeTopic;
