import React, { memo, useEffect, useMemo } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from '@/components/ui/sheet';
import { cn, formatDate } from '@/lib/utils';
import { useSidebarStore } from '@/store';
import { useInView } from 'react-intersection-observer';
import Exception from '@/components/custom/exception';
import type { NoticeItem } from '@/types';

interface NoticeSheetProps {
    children: React.ReactNode;
}

const NoticeItem: React.FC<{ item: NoticeItem }> = memo(({ item }) => {
    const { title, content, createdAt } = item;

    const formattedDate = useMemo(
        () => formatDate(createdAt, 'yyyy-MM-dd'),
        [createdAt]
    );

    return (
        <div
            className={cn('bg-muted rounded-sm p-4 space-y-2 mt-5 first:mt-0')}
        >
            <div className={cn('flex items-center justify-between')}>
                <div className={cn('flex-1 line-clamp-1')} title={title}>
                    {title}
                </div>
                <div className={cn('text-sm text-muted-foreground ml-4')}>
                    {formattedDate}
                </div>
            </div>
            <div className={cn('text-sm tracking-wide text-card-foreground')}>
                {content}
            </div>
        </div>
    );
});

NoticeItem.displayName = 'NoticeItem';

interface NoticeListProps {
    ref: (node?: Element | null) => void;
    list: NoticeItem[];
    hasMore: boolean;
}

const NoticeList: React.FC<NoticeListProps> = ({ ref, list, hasMore }) => {
    return (
        <div
            className={cn(
                'p-5 bg-input dark:bg-black h-[calc(100%-8.25rem)] overflow-auto'
            )}
        >
            {list.length ? (
                <div className={cn('flex flex-col')}>
                    {list.map(item => (
                        <NoticeItem key={item.id} item={item} />
                    ))}
                    {/* 触底加载的锚点 */}
                    {hasMore && <div ref={ref} style={{ height: 0 }} />}
                </div>
            ) : (
                <Exception type="empty" className={cn('w-64')} />
            )}
        </div>
    );
};

NoticeList.displayName = 'NoticeList';

const NoticeSheet: React.FC<NoticeSheetProps> = ({ children }) => {
    const fetchData = useSidebarStore(state => state.notice.fetchData);
    const loadMore = useSidebarStore(state => state.notice.loadMore);
    const list = useSidebarStore(state => state.notice.list);
    const loading = useSidebarStore(state => state.notice.loading);
    const hasMore = useSidebarStore(state => state.notice.hasMore);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const { ref } = useInView({
        threshold: 0,
        onChange: inView => {
            if (inView && !loading && hasMore) {
                loadMore();
            }
        }
    });

    return (
        <Sheet>
            <SheetTrigger>{children}</SheetTrigger>
            <SheetContent
                close={false}
                side="left"
                className={cn('w-md left-17 top-[67px] z-5')}
                overlayClassName={cn('bg-transparent z-4')}
                aria-describedby={undefined}
            >
                <SheetHeader className={cn('bg-background p-5')}>
                    <SheetTitle>系统公告</SheetTitle>
                </SheetHeader>
                <NoticeList ref={ref} list={list} hasMore={hasMore} />
            </SheetContent>
        </Sheet>
    );
};

NoticeSheet.displayName = 'NoticeSheet';

export default NoticeSheet;
