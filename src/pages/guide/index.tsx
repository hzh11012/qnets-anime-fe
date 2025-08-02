import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { useGuideStore } from '@/store';
import AnimeGuide from '@/pages/guide/anime-guide';

const Rank: React.FC = () => {
    const navigate = useNavigate();

    const loading = useGuideStore(state => state.loading);
    const guides = useGuideStore(state => state.list);
    const total = useGuideStore(state => state.total);
    const updateDay = useGuideStore(state => state.updateDay);
    const fetchData = useGuideStore(state => state.fetchData);
    const loadMore = useGuideStore(state => state.loadMore);
    const setUpdateDay = useGuideStore(state => state.setUpdateDay);

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
            <AnimeGuide
                title="新番导视"
                defaultUpdateDay={updateDay}
                loading={loading}
                list={guides}
                total={total}
                onUpdateDayChage={setUpdateDay}
                onLoadMore={loadMore}
                onAnimeClick={handleAnimeClick}
            />
        </div>
    );
};

export default Rank;
