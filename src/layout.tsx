import React from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import AppHeader from '@/components/layout/app-header';
import AppContent from '@/components/layout/app-content';

const Layout: React.FC = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <AppHeader />
                <AppContent />
            </SidebarInset>
        </SidebarProvider>
    );
};

export default Layout;
