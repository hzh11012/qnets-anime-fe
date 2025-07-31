'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const SIDEBAR_WIDTH = '4.25rem';

type SidebarContextProps = {
    state: 'expanded' | 'collapsed';
    open: boolean;
    setOpen: (open: boolean) => void;
    toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextProps | null>(null);

const useSidebar = () => {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider.');
    }

    return context;
};

function SidebarProvider({
    defaultOpen = true,
    className,
    open: openProp,
    onOpenChange: setOpenProp,
    style,
    children,
    ...props
}: React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}) {
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
        (value: boolean | ((value: boolean) => boolean)) => {
            const openState = typeof value === 'function' ? value(open) : value;
            if (setOpenProp) {
                setOpenProp(openState);
            } else {
                _setOpen(openState);
            }
        },
        [setOpenProp, open]
    );

    const toggleSidebar = React.useCallback(() => {
        return setOpen(open => !open);
    }, [setOpen]);

    // We add a state so that we can do data-state="expanded" or "collapsed".
    // This makes it easier to style the sidebar with Tailwind classes.
    const state = open ? 'expanded' : 'collapsed';

    const contextValue = React.useMemo<SidebarContextProps>(
        () => ({ state, open, setOpen, toggleSidebar }),
        [state, open, setOpen, toggleSidebar]
    );

    return (
        <SidebarContext.Provider value={contextValue}>
            <div
                data-slot="sidebar-wrapper"
                style={
                    {
                        '--sidebar-width': SIDEBAR_WIDTH,
                        ...style
                    } as React.CSSProperties
                }
                className={cn('group flex min-h-svh w-full', className)}
                {...props}
            >
                {children}
            </div>
        </SidebarContext.Provider>
    );
}

function SidebarTrigger({
    className,
    onClick,
    children,
    ...props
}: React.ComponentProps<'div'>) {
    const { toggleSidebar } = useSidebar();

    return (
        <div
            data-sidebar="trigger"
            data-slot="sidebar-trigger"
            className={cn(className)}
            onClick={event => {
                onClick?.(event);
                toggleSidebar();
            }}
            {...props}
        >
            {children}
        </div>
    );
}

function Sidebar({
    wrapperClassName,
    className,
    innerClassName,
    children,
    ...props
}: React.ComponentProps<'div'> & {
    wrapperClassName?: string;
    innerClassName?: string;
}) {
    const { state } = useSidebar();

    return (
        <div
            className={cn(
                'group peer text-card-foreground hidden md:block',
                wrapperClassName
            )}
            data-state={state}
            data-slot="sidebar"
        >
            {/* This is what handles the sidebar gap on desktop */}
            <div
                data-slot="sidebar-gap"
                className={cn(
                    'relative w-(--sidebar-width) bg-transparent',
                    'md:group-data-[state=collapsed]:w-0'
                )}
            />
            <div
                data-slot="sidebar-container"
                className={cn(
                    'fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) md:flex',
                    'md:group-data-[state=collapsed]:w-0',
                    className
                )}
                {...props}
            >
                <div
                    data-sidebar="sidebar"
                    data-slot="sidebar-inner"
                    className={cn(
                        'bg-card flex size-full flex-col',
                        innerClassName
                    )}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

function SidebarInset({ className, ...props }: React.ComponentProps<'main'>) {
    return (
        <main
            data-slot="sidebar-inset"
            className={cn(
                'bg-background relative flex w-full flex-1 flex-col overflow-hidden',
                className
            )}
            {...props}
        />
    );
}

function SidebarHeader({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="sidebar-header"
            data-sidebar="header"
            className={cn('flex flex-col gap-2 p-2', className)}
            {...props}
        />
    );
}

function SidebarContent({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="sidebar-content"
            data-sidebar="content"
            className={cn(
                'flex min-h-0 flex-1 flex-col gap-2 p-2 overflow-y-auto scrollbar-hide!',
                className
            )}
            {...props}
        />
    );
}

function SidebarFooter({ className, ...props }: React.ComponentProps<'div'>) {
    return (
        <div
            data-slot="sidebar-footer"
            data-sidebar="footer"
            className={cn('flex flex-col gap-2 p-2', className)}
            {...props}
        />
    );
}

export {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
};
