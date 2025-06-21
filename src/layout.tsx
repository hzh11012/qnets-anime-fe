import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import AppHeader from '@/components/layout/app-header';
import { HeaderInset, HeaderProvider } from './components/ui/header';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <HeaderProvider>
                    <AppHeader />
                    <HeaderInset>
                        <Outlet />
                    </HeaderInset>
                </HeaderProvider>
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Layout;
