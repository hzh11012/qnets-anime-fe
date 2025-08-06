import React, { useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useNavigate, useSearchParams } from 'react-router-dom';
import BangumiSelect from '@/pages/bangumi/bangumi-select';
import { useBangumiStore } from '@/store';
import AnimeBangumi from './anime-bangumi';

const useBangumi = () => {
    const navigate = useNavigate();

    const [searchParams, setSearchParams] = useSearchParams();
    const order = searchParams.get('order') || undefined;
    const type = searchParams.get('type') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const status = searchParams.get('status') || undefined;
    const year = searchParams.get('year') || undefined;
    const month = searchParams.get('month') || undefined;

    const loading = useBangumiStore(state => state.loading);
    const list = useBangumiStore(state => state.list);
    const hasMore = useBangumiStore(state => state.hasMore);
    const fetchData = useBangumiStore(state => state.fetchData);
    const loadMore = useBangumiStore(state => state.loadMore);
    const reset = useBangumiStore(state => state.reset);

    useEffect(() => {
        fetchData({
            order: order,
            type: type,
            tag: tag,
            status: status,
            year: year,
            month: month
        });

        return () => {
            reset();
        };
    }, [order, type, tag, status, year, month, fetchData, reset]);

    const handleLoadMore = useCallback(() => {
        loadMore({
            order: order,
            type: type,
            tag: tag,
            status: status,
            year: year,
            month: month
        });
    }, [order, type, tag, status, year, month, loadMore]);

    const handleAnimeClick = useCallback(
        (id: string) => {
            id && navigate(`/anime/${id}`);
        },
        [navigate]
    );

    // 更新单个参数（保留其他参数）
    const handleParamsChange = useCallback(
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

    return {
        order: order || '',
        type: type || '',
        tag: tag || '',
        status: status || '',
        year: year || '',
        month: month || '',
        loading,
        list,
        hasMore,
        handleLoadMore,
        handleAnimeClick,
        handleParamsChange
    };
};

const Bangumi: React.FC = () => {
    const {
        order,
        type,
        tag,
        status,
        year,
        month,
        loading,
        list,
        hasMore,
        handleLoadMore,
        handleAnimeClick,
        handleParamsChange
    } = useBangumi();

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
                onChange={handleParamsChange}
            />
            <AnimeBangumi
                list={list}
                hasMore={hasMore}
                loading={loading}
                onLoadMore={handleLoadMore}
                onAnimeClick={handleAnimeClick}
            />
        </div>
    );
};

Bangumi.displayName = 'Bangumi';

export default Bangumi;
