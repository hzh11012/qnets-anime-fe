import React from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store';
import MineCard from '@/pages/mine/mine-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SettingCard from '@/pages/mine/setting-card';
import MineCollection from '@/pages/mine/mine-collection';
import MineHistory from '@/pages/mine/mine-history';

const Mine: React.FC = () => {
    const nickName = useUserStore(state => state.userInfo.nickname);
    const avatar = useUserStore(state => state.userInfo.avatar);
    const email = useUserStore(state => state.userInfo.email);

    return (
        <div
            className={cn(
                'relative flex flex-col gap-4 h-full md:gap-8 my-4 md:my-8',
                'transition-[margin] duration-200'
            )}
        >
            {createPortal(<SettingCard />, document.body)}
            <MineCard nickName={nickName} avatar={avatar} email={email} />
            <Tabs
                defaultValue="collection"
                className={cn('size-full select-none')}
            >
                <TabsList
                    className={cn(
                        'min-h-[3.125rem] gap-6 border-b-1 w-full justify-start'
                    )}
                >
                    <TabsTrigger
                        className={cn(
                            'w-18 flex-none text-base after:inset-x-7'
                        )}
                        value="collection"
                    >
                        我的追番
                    </TabsTrigger>
                    <TabsTrigger
                        className={cn(
                            'w-18 flex-none text-base after:inset-x-7'
                        )}
                        value="history"
                    >
                        历史记录
                    </TabsTrigger>
                </TabsList>
                <TabsContent className={cn('mt-4 md:mt-6')} value="collection">
                    <MineCollection />
                </TabsContent>
                <TabsContent className={cn('mt-4 md:mt-6')} value="history">
                    <MineHistory />
                </TabsContent>
            </Tabs>
        </div>
    );
};

Mine.displayName = 'Mine';

export default Mine;
