import React, { memo, useCallback, useLayoutEffect, useMemo } from 'react';
import { cn, generateYearOptions } from '@/lib/utils';
import { useUserStore } from '@/store';
import { useBangumiStore } from '@/store';

const ORDER_LIST = [
    {
        label: '综合排序',
        value: ''
    },
    {
        label: '最多追番',
        value: '0'
    },
    {
        label: '最多播放',
        value: '1'
    },
    {
        label: '最近更新',
        value: '2'
    },
    {
        label: '最高评分',
        value: '3'
    }
] as const;

const ALL_TYPE_LIST = [
    {
        label: '全部类型',
        value: ''
    },
    {
        label: '剧场版',
        value: '0'
    },
    {
        label: '日番',
        value: '1'
    },
    {
        label: '美漫',
        value: '2'
    },
    {
        label: '国创',
        value: '3'
    },
    {
        label: '里番',
        value: '4'
    }
] as const;

const NORMAL_TYPE_LIST = ALL_TYPE_LIST.slice(0, 5);

const STATUS_LIST = [
    {
        label: '完结状态',
        value: ''
    },
    {
        label: '已完结',
        value: '2'
    },
    {
        label: '连载中',
        value: '1'
    },
    {
        label: '即将开播',
        value: '0'
    }
] as const;

const YEAR_LIST = generateYearOptions();

const MONTH_LIST = [
    {
        label: '全部季度',
        value: ''
    },
    {
        label: '1月',
        value: '0'
    },
    {
        label: '4月',
        value: '1'
    },
    {
        label: '7月',
        value: '2'
    },
    {
        label: '10月',
        value: '3'
    }
] as const;

interface BangumiListProps {
    type: string;
    value: string;
    list: readonly { label: string; value: string }[];
    onChange: (key: string, value: string) => void;
}

const BangumiList: React.FC<BangumiListProps> = ({
    type,
    list,
    value,
    onChange
}) => {
    const handleSearchChange = useCallback(
        (value: string) => {
            onChange(type, value);
        },
        [type, onChange]
    );

    if (!list.length) {
        return null;
    }

    return (
        <div className={cn('flex items-center flex-wrap gap-x-2')}>
            {list.map(item => {
                const { label, value: val } = item;
                return (
                    <div
                        key={label + val}
                        className={cn(
                            'text-sm px-3.5 py-1.5 rounded-sm cursor-pointer',
                            'hover:text-primary transition-[color] duration-200',
                            {
                                'text-primary bg-primary/25': value === val
                            }
                        )}
                        onClick={() => handleSearchChange(val)}
                    >
                        {label}
                    </div>
                );
            })}
        </div>
    );
};

BangumiList.displayName = 'BangumiList';

interface BangumiSelectProps {
    order: string;
    type: string;
    tag: string;
    status: string;
    year: string;
    month: string;
    onChange: (key: string, value: string) => void;
}

const useBangumiSelect = () => {
    const tags = useBangumiStore(state => state.tags);
    const fetchTagData = useBangumiStore(state => state.fetchTagData);
    const isAllowViewHentai = useUserStore(state => state.isAllowViewHentai);
    const TYPE_LIST = useMemo(
        () => (isAllowViewHentai ? ALL_TYPE_LIST : NORMAL_TYPE_LIST),
        [isAllowViewHentai]
    );

    useLayoutEffect(() => {
        fetchTagData();
    }, [fetchTagData]);

    return {
        tags: [{ label: '全部风格', value: '' }].concat(tags),
        TYPE_LIST
    };
};

const BangumiSelect: React.FC<BangumiSelectProps> = memo(
    ({ order, type, tag, status, year, month, onChange }) => {
        const { tags, TYPE_LIST } = useBangumiSelect();

        return (
            <div className={cn('flex flex-col gap-2.5 select-none')}>
                <BangumiList
                    list={ORDER_LIST}
                    type="order"
                    value={order}
                    onChange={onChange}
                />
                <BangumiList
                    list={TYPE_LIST}
                    type="type"
                    value={type}
                    onChange={onChange}
                />
                <BangumiList
                    list={tags}
                    type="tag"
                    value={tag}
                    onChange={onChange}
                />
                <BangumiList
                    list={STATUS_LIST}
                    type="status"
                    value={status}
                    onChange={onChange}
                />
                <BangumiList
                    list={YEAR_LIST}
                    type="year"
                    value={year}
                    onChange={onChange}
                />
                <BangumiList
                    list={MONTH_LIST}
                    type="month"
                    value={month}
                    onChange={onChange}
                />
            </div>
        );
    }
);

BangumiSelect.displayName = 'BangumiSelect';

export default BangumiSelect;
