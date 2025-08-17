import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { CircleXIcon, SearchIcon } from 'lucide-react';
import { useClickAway } from 'ahooks';
import { useSearchHistoryStore } from '@/store';
import Exception from '@/components/custom/exception';
import type { AnimeSuggestItem } from '@/types';
import { useSearchParams } from 'react-router-dom';

interface SearchInputProps {
    suggests: AnimeSuggestItem[];
    className?: string;
    placeholder?: string;
    onSubmit: (value: string) => void;
    onChange: (keyword: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
    className,
    onSubmit,
    onChange,
    suggests,
    ...props
}) => {
    const [searchParams] = useSearchParams();
    const _keyword = searchParams.get('keyword') || '';
    const containerRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [keyword, setKeyword] = useState(_keyword);
    const [isFocused, setIsFocused] = useState(false);

    useClickAway(() => setIsFocused(false), containerRef, 'mousedown');

    const activated = useMemo(() => {
        return !!(keyword || isFocused);
    }, [keyword, isFocused]);

    // 搜索历史相关
    const histories = useSearchHistoryStore(state => state.histories);
    const createHistory = useSearchHistoryStore(state => state.createHistory);
    const removeHistory = useSearchHistoryStore(state => state.removeHistory);
    const clearHistory = useSearchHistoryStore(state => state.clearHistory);

    useEffect(() => {
        keyword && onChange(keyword);
    }, []);

    // 处理搜索提交
    const handleSubmit = useCallback(() => {
        const trimmedKeyword = keyword.trim();
        if (trimmedKeyword) {
            setIsFocused(false);
            createHistory(trimmedKeyword);
            onSubmit(trimmedKeyword);
        }
    }, [keyword, createHistory, onSubmit]);

    // 处理输入变化
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const keyword = e.target.value;
        setKeyword(keyword);
        setIsFocused(true);
        onChange(keyword);
    };

    // 处理清空输入
    const handleClear = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        setKeyword('');
        inputRef.current?.focus();
    }, []);

    // 处理键盘事件
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    // 处理历史记录点击
    const handleHistoryClick = useCallback(
        (e: React.MouseEvent, historyItem: string) => {
            e.stopPropagation();
            setIsFocused(false);
            setKeyword(historyItem);
            createHistory(historyItem);
            onSubmit(historyItem);
        },
        [createHistory, onSubmit]
    );

    // 处理删除历史记录
    const handleRemoveHistory = useCallback(
        (e: React.MouseEvent, historyItem: string) => {
            e.stopPropagation();
            removeHistory(historyItem);
        },
        [removeHistory]
    );

    // 处理清空历史记录
    const handleClearHistory = useCallback(() => {
        clearHistory();
    }, [clearHistory]);

    const handlePopoverClick = () => {
        inputRef.current?.focus();
    };

    return (
        <div
            ref={containerRef}
            className={cn('flex items-center', className)}
            data-activated={activated}
        >
            <Input
                ref={inputRef}
                className={cn(
                    'w-full pl-2.5 md:pl-4',
                    'hover:bg-accent focus-visible:bg-transparent!',
                    'bg-input border-transparent',
                    {
                        'pr-16 md:border-ring md:bg-transparent!': keyword,
                        'pr-10.5': !keyword
                    }
                )}
                value={keyword}
                onChange={handleChange}
                onFocus={() => setIsFocused(true)}
                onKeyDown={handleKeyDown}
                maxLength={255}
                {...props}
            />
            {/* 清空按钮 */}
            {keyword && (
                <CircleXIcon
                    className={cn(
                        'absolute end-11 cursor-pointer text-foreground/40',
                        'transition-[color] hover:text-muted-foreground duration-200'
                    )}
                    onClick={handleClear}
                    size={14}
                    aria-label="清空输入"
                />
            )}
            <SearchIcon
                className={cn(
                    'absolute end-4 cursor-pointer text-foreground',
                    'transition-[color] hover:text-muted-foreground duration-200'
                )}
                onClick={handleSubmit}
                size={18}
                aria-label="搜索"
            />
            {isFocused && (
                <div
                    className={cn(
                        'absolute top-11 w-full bg-background border border-accent min-h-42.5 rounded-sm overflow-hidden'
                    )}
                    onClick={handlePopoverClick}
                >
                    {keyword ? (
                        <div
                            className={cn({
                                'flex flex-col py-2 gap-1': suggests.length,
                                'p-4': !suggests.length
                            })}
                        >
                            {suggests.length ? (
                                <>
                                    {suggests.map((item, index) => {
                                        return (
                                            <div
                                                key={index}
                                                className={cn(
                                                    'flex items-center h-8 text-sm cursor-pointer px-4',
                                                    'hover:bg-input'
                                                )}
                                                onClick={e =>
                                                    handleHistoryClick(
                                                        e,
                                                        item.name
                                                    )
                                                }
                                            >
                                                <div
                                                    className={cn(
                                                        'w-full break-all line-clamp-1'
                                                    )}
                                                    dangerouslySetInnerHTML={{
                                                        __html: item.highlightName
                                                    }}
                                                ></div>
                                            </div>
                                        );
                                    })}
                                </>
                            ) : (
                                <div className={cn('w-auto h-[8.5rem]')}>
                                    <Exception type="empty" />
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={cn('p-4')}>
                            <div
                                className={cn(
                                    'flex items-center justify-between select-none'
                                )}
                            >
                                <div>搜索历史</div>
                                <span
                                    className={cn(
                                        'text-xs text-muted-foreground cursor-pointer',
                                        'hover:text-primary transition-[color] duration-200'
                                    )}
                                    onClick={handleClearHistory}
                                >
                                    清空
                                </span>
                            </div>
                            <div className={cn('flex mt-4 gap-2.5 flex-wrap')}>
                                {histories.length ? (
                                    histories.map(item => {
                                        return (
                                            <div
                                                key={item}
                                                className={cn(
                                                    'relative group/history cursor-pointer select-none'
                                                )}
                                                onClick={e =>
                                                    handleHistoryClick(e, item)
                                                }
                                            >
                                                <div
                                                    className={cn(
                                                        'py-1 px-2.5 bg-input text-sm rounded-sm max-w-30 line-clamp-1',
                                                        'hover:text-primary transition-[color] duration-200'
                                                    )}
                                                >
                                                    {item}
                                                </div>
                                                <CircleXIcon
                                                    className={cn(
                                                        'group-hover/history:block hidden absolute -top-1 -right-1 text-foreground/40'
                                                    )}
                                                    onClick={e =>
                                                        handleRemoveHistory(
                                                            e,
                                                            item
                                                        )
                                                    }
                                                    size={12}
                                                />
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className={cn('w-auto h-24')}>
                                        <Exception type="empty" />
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchInput;
