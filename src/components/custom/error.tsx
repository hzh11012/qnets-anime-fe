import { CircleX } from 'lucide-react';

import { cn } from '@/lib/utils';

const Error = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                'fixed top-0 left-0 w-full h-full flex items-center justify-center z-50',
                className
            )}
        >
            <CircleX className={cn('size-5')} />
            <p className={cn('ml-2')}>服务错误</p>
        </div>
    );
};
Error.displayName = 'Error';

export default Error;
