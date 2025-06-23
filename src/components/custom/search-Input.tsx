import React, { useRef, useState } from 'react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';
import { CircleXIcon, SearchIcon } from 'lucide-react';
import { useDebounce, useDebounceFn } from 'ahooks';

interface SearchInputProps {
    className?: string;
    inputClassName?: string;
    placeholder?: string;
    onSubmit: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
    className,
    inputClassName,
    onSubmit,
    ...props
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [keyword, setKeyword] = useState('');
    const debouncedValue = useDebounce(keyword, { wait: 200 });
    const [isFocus, setIsFocus] = useState(false);

    const { run: handleSubmit } = useDebounceFn(
        () => {
            if (debouncedValue.trim()) {
                onSubmit(debouncedValue);
            }
        },
        { wait: 200 }
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setKeyword(value);
    };

    const handleClear = () => {
        setKeyword('');
        inputRef.current?.focus();
    };

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        // 阻止默认行为，避免输入框失去焦点
        e.preventDefault();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <div
            className={cn('flex items-center', className)}
            data-value={!!keyword}
            data-focus={isFocus}
        >
            <Input
                data-value={!!keyword}
                ref={inputRef}
                className={cn(
                    'w-full pl-2.5 md:pl-4',
                    `${keyword ? 'pr-16' : 'pr-10.5'}`,
                    inputClassName
                )}
                onChange={handleChange}
                value={keyword}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onKeyDown={handleKeyDown}
                {...props}
            />
            {keyword && (
                <CircleXIcon
                    className={cn(
                        'absolute end-11 cursor-pointer text-foreground/40',
                        'transition-[color] hover:text-muted-foreground'
                    )}
                    onClick={handleClear}
                    onMouseDown={handleMouseDown}
                    size={14}
                    aria-hidden="true"
                />
            )}
            <SearchIcon
                className={cn(
                    'absolute end-4 cursor-pointer text-foreground',
                    'transition-[color] hover:text-muted-foreground'
                )}
                onClick={handleSubmit}
                onMouseDown={handleMouseDown}
                size={18}
                aria-hidden="true"
            />
        </div>
    );
};

export default SearchInput;
