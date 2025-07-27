import React, { useEffect, useMemo } from 'react';
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

interface MailSheetProps {
    children: React.ReactNode;
}

const NoticeSheet: React.FC<MailSheetProps> = ({ children }) => {
    const fetchNoticeData = useSidebarStore(state => state.fetchNoticeData);
    const loadMore = useSidebarStore(state => state.loadMore);
    const notices = useSidebarStore(state => state.notices);

    useEffect(() => {
        fetchNoticeData();
    }, []);

    const hasMore = useMemo(() => {
        return notices.list.length < notices.total;
    }, [notices.list, notices.total]);

    const { ref } = useInView({
        threshold: 0,
        onChange: inView => {
            if (inView && !notices.loading && hasMore) {
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
            >
                <SheetHeader className={cn('bg-background p-5')}>
                    <SheetTitle>系统公告</SheetTitle>
                </SheetHeader>
                <div
                    className={cn(
                        'p-5 bg-input dark:bg-black h-[calc(100%-8.25rem)] overflow-auto'
                    )}
                >
                    {notices.list.length ? (
                        <div className={cn('flex flex-col')}>
                            {notices.list.map(item => {
                                const { id, title, content, createdAt } = item;
                                return (
                                    <div
                                        key={id}
                                        className={cn(
                                            'bg-muted rounded-sm p-4 space-y-2 mt-5 first:mt-0'
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                'flex items-center justify-between'
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    'flex-1 line-clamp-1'
                                                )}
                                                title={title}
                                            >
                                                {title}
                                            </div>
                                            <div
                                                className={cn(
                                                    'text-sm text-muted-foreground ml-4'
                                                )}
                                            >
                                                {formatDate(
                                                    createdAt,
                                                    'yyyy-MM-dd'
                                                )}
                                            </div>
                                        </div>
                                        <div
                                            className={cn(
                                                'text-sm tracking-wide text-card-foreground'
                                            )}
                                        >
                                            {content}
                                        </div>
                                    </div>
                                );
                            })}
                            {/* 触底加载的锚点 */}
                            <div
                                ref={hasMore ? ref : undefined}
                                style={{ height: 0 }}
                            />
                        </div>
                    ) : (
                        <Exception type="empty" className={cn('w-64')} />
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
};

export default NoticeSheet;
