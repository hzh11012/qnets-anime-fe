import React, { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BangumiSelect from '@/pages/bangumi/bangumi-select';
import { useBangumiStore } from '@/store';
import AnimeBangumi from './anime-bangumi';

const Bangumi: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const order = searchParams.get('order') || '';
    const type = searchParams.get('type') || '';
    const tag = searchParams.get('tag') || '';
    const status = searchParams.get('status') || '';
    const year = searchParams.get('year') || '';
    const month = searchParams.get('month') || '';

    const loading = useBangumiStore(state => state.loading);
    const animes = useBangumiStore(state => state.list);
    const total = useBangumiStore(state => state.total);
    const fetchData = useBangumiStore(state => state.fetchData);
    const loadMore = useBangumiStore(state => state.loadMore);

    useEffect(() => {
        fetchData({
            order: order || undefined,
            type: type || undefined,
            tag: tag || undefined,
            status: status || undefined,
            year: year || undefined,
            month: month || undefined
        });
    }, [order, type, tag, status, year, month, fetchData]);

    // 更新单个参数（保留其他参数）
    const updateParam = useCallback(
        (key: string, value: string) => {
            // 创建当前查询参数的可修改副本
            const params = new URLSearchParams(searchParams);

            // 根据值类型决定操作
            if (value === null || value === undefined || value === '') {
                params.delete(key); // 删除参数
            } else {
                params.set(key, value); // 设置/更新参数
            }

            setSearchParams(params, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    const handleAnimeClick = (id: string) => {
        id && navigate(`/anime/${id}`);
    };

    const handleLoadMore = useCallback(() => {
        loadMore({
            order: order || undefined,
            type: type || undefined,
            tag: tag || undefined,
            status: status || undefined,
            year: year || undefined,
            month: month || undefined
        });
    }, [order, type, tag, status, year, month, loadMore]);

    return (
        <div
            className={cn(
                'flex flex-col gap-4 h-full md:gap-8 my-4 md:my-8',
                'transition-[margin] duration-200'
            )}
        >
            <BangumiSelect
                order={order}
                type={type}
                tag={tag}
                status={status}
                year={year}
                month={month}
                onChange={updateParam}
            />
            <AnimeBangumi
                list={animes}
                total={total}
                loading={loading}
                onLoadMore={handleLoadMore}
                onAnimeClick={handleAnimeClick}
            />
        </div>
    );
};

export default Bangumi;
