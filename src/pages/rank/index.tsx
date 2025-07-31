import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useRankStore } from '@/store';
import AnimeRank from '@/pages/rank/anime-rank';

const Rank: React.FC = () => {
    const navigate = useNavigate();

    const loading = useRankStore(state => state.loading);
    const ranks = useRankStore(state => state.list);
    const total = useRankStore(state => state.total);
    const fetchData = useRankStore(state => state.fetchData);
    const loadMore = useRankStore(state => state.loadMore);

    useEffect(() => {
        fetchData();
    }, []);

    const handleAnimeClick = (id: string) => {
        id && navigate(`/anime/${id}`);
    };

    return (
        <div
            className={cn(
                'flex flex-col gap-4 h-full md:gap-8 my-4 md:my-8',
                'transition-[margin] duration-200'
            )}
        >
            <AnimeRank
                title="热门动漫排行"
                description="（该榜单每小时更新一次）"
                loading={loading}
                list={ranks}
                total={total}
                onLoadMore={loadMore}
                onAnimeClick={handleAnimeClick}
            />
        </div>
    );
};

export default Rank;
