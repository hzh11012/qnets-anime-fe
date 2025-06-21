import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                'placeholder:select-none placeholder:text-muted-foreground selection:bg-primary selection:text-foreground flex h-9 w-full min-w-0 rounded-sm border border-transparent bg-input px-3 py-1 outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-sm',
                'focus-visible:border-ring focus-visible:bg-transparent!',
                'hover:bg-accent',
                'transition-colors',
                className
            )}
            {...props}
        />
    );
}

export { Input };
