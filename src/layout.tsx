import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import AppHeader from '@/components/layout/app-header';
import AppFooter from '@/components/layout/app-footer';
import { HeaderInset, HeaderProvider } from './components/ui/header';
import { Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Layout: React.FC = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <HeaderProvider>
                    <AppHeader />
                    <HeaderInset
                        className={cn(
                            'md:max-w-[110.25rem] md:mx-auto md:px-8 px-4',
                            'transition-[max-width,padding,margin]'
                        )}
                    >
                        <Outlet />
                    </HeaderInset>
                    <AppFooter />
                </HeaderProvider>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Layout;
