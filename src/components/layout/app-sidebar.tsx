import React from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader
} from '@/components/ui/sidebar';
import Logo from '@/components/custom/logo';
import { links } from '@/links';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore } from '@/store';
import { Fan, Mail, LogOut } from 'lucide-react';
import { useNavigate, useMatch } from 'react-router-dom';
import ThemeSwitch from '@/components/custom/theme-switch';
import FailAvatar from '../custom/fail-avatar';

const sidebarBtnClass =
    'flex flex-col items-center text-card-foreground cursor-pointer transition-colors group/link hover:text-primary-foreground select-none';

const AppSidebar: React.FC = () => {
    const user = useUserStore(state => state.userInfo);
    const navigate = useNavigate();

    return (
        <Sidebar>
            <SidebarHeader
                className={cn('h-[4.25rem] items-center justify-center')}
            >
                <Logo size="2rem" />
            </SidebarHeader>
            <SidebarContent className={cn('text-[0.75rem] gap-6 py-8')}>
                {links.map((link, index) => {
                    const { title, icon: Icon, url } = link;
                    const isActive = useMatch(url);
                    return (
                        <div
                            key={index}
                            className={cn(sidebarBtnClass, 'gap-1', {
                                'text-primary-foreground': isActive
                            })}
                            onClick={() => navigate(url)}
                        >
                            <Icon size={22} />
                            <span
                                className={cn(
                                    'transition-colors text-muted-foreground group-hover/link:text-primary-foreground/70',
                                    { 'text-primary-foreground/70': isActive }
                                )}
                            >
                                {title}
                            </span>
                        </div>
                    );
                })}
            </SidebarContent>
            <SidebarFooter
                className={cn('items-center justify-center gap-6 pb-8')}
            >
                <Avatar className={cn('size-8 cursor-pointer')} title="空间">
                    <AvatarImage src={user.avatar || ''} alt={user.nickname} />
                    <AvatarFallback>
                        <FailAvatar />
                    </AvatarFallback>
                </Avatar>
                <div className={cn(sidebarBtnClass)} title="公告">
                    <Mail size={22} />
                </div>
                <div className={cn(sidebarBtnClass)} title="动态">
                    <Fan size={22} />
                </div>
                <div className={cn(sidebarBtnClass)} title="主题">
                    <ThemeSwitch />
                </div>
                <div className={cn(sidebarBtnClass)} title="退出">
                    <LogOut size={22} />
                </div>
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSidebar;
