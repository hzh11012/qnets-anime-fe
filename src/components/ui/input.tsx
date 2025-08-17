import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                'placeholder:select-none placeholder:text-muted-foreground flex h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 outline-none selection:bg-primary selection:text-primary-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 text-sm focus-visible:border-ring transition-colors',
                className
            )}
            {...props}
        />
    );
}

export { Input };
