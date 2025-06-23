'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const FOOTER_HEIGHT = '4.25rem';

function Footer({
    className,
    style,
    children,
    ...props
}: React.ComponentProps<'div'>) {
    return (
        <div
            className="flex md:hidden"
            data-slot="footer"
            style={
                {
                    '--footer-height': FOOTER_HEIGHT,
                    ...style
                } as React.CSSProperties
            }
        >
            {/* This is what handles the header gap on desktop */}
            <div
                data-slot="footer-gap"
                className={cn('relative h-(--footer-height) bg-transparent')}
            />
            <div
                data-slot="footer-container"
                className={cn(
                    'fixed z-10 left-0 right-0 h-(--footer-height) flex bottom-0 border-t-1'
                )}
            >
                <div
                    data-footer="footer"
                    data-slot="footer-inner"
                    className={cn(
                        'relative bg-background flex size-full',
                        className
                    )}
                    {...props}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}
export { Footer };
