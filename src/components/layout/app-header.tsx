import React from 'react';
import Logo from '@/components/custom/logo';
import { Header, HeaderLeft, HeaderRight } from '@/components/ui/header';
import SearchInput from '@/components/custom/search-Input';
import { cn } from '@/lib/utils';

const AppHeader: React.FC = () => {
    const handleSubmit = (value: string) => {
        // TODO
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
                    placeholder="搜索你感兴趣的动漫"
                    className={cn(
                        'absolute right-4 md:right-8 w-1/2 md:w-[18.625rem]',
                        'transition-[width,right,color,background-color,border-color] duration-200',
                        'md:data-[focus=true]:right-[calc(50%-13.4375rem)] md:data-[focus=true]:w-[26.875rem]',
                        'md:data-[value=true]:right-[calc(50%-13.4375rem)] md:data-[value=true]:w-[26.875rem]'
                    )}
                    inputClassName={cn(
                        'md:data-[value=true]:border-ring md:data-[value=true]:bg-transparent!'
                    )}
                />
            </HeaderRight>
        </Header>
    );
};

export default AppHeader;
