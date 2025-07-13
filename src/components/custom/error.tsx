import { CircleX } from 'lucide-react';

import { cn } from '@/lib/utils';

const Error = ({
    className,
    text = '服务错误'
}: {
    className?: string;
    text?: string;
}) => {
    return (
        <div
            className={cn(
                'fixed top-0 left-0 w-full h-full flex items-center justify-center z-50',
                className
            )}
        >
            <CircleX className={cn('size-5')} />
            <p className={cn('ml-2')}>{text}</p>
        </div>
    );
};
Error.displayName = 'Error';

export default Error;
