import React from 'react';
import Logo from '@/components/custom/logo';
import { Header, HeaderLeft, HeaderRight } from '@/components/ui/header';
import SearchInput from '@/components/layout/search-Input';
import { cn } from '@/lib/utils';
import { useSearchSuggestStore } from '@/store';
import { useNavigate } from 'react-router-dom';

const AppHeader: React.FC = () => {
    const navigate = useNavigate();

    const suggests = useSearchSuggestStore(state => state.list);
    const fetchData = useSearchSuggestStore(state => state.fetchData);

    const handleSubmit = async (value: string) => {
        await fetchData(value);
        navigate(`search?keyword=${value}`);
    };

    const handleChange = async (keyword: string) => {
        if (keyword.trim()) {
            await fetchData(keyword);
        }
    };

    return (
        <Header className={cn('px-[1.125rem] md:px-8 justify-between')}>
            <HeaderLeft className={cn('pl-0 items-center')}>
                <Logo type="favicon" className={cn('md:hidden')} />
                <Logo
                    type="logo"
                    className={cn('w-auto h-8 hidden md:block')}
                />
            </HeaderLeft>
            <HeaderRight className={cn('p-0 items-center')}>
                <SearchInput
                    onSubmit={handleSubmit}
                    onChange={handleChange}
                    suggests={suggests}
                    placeholder="搜索你感兴趣的动漫"
                    className={cn(
                        'absolute right-4 md:right-8 w-1/2 md:w-[18.625rem]',
                        'transition-[width,right,color,background-color,border-color] duration-200',
                        'md:data-[activated=true]:right-[calc(50%-13.4375rem)] md:data-[activated=true]:w-[26.875rem]'
                    )}
                />
            </HeaderRight>
        </Header>
    );
};

export default AppHeader;
