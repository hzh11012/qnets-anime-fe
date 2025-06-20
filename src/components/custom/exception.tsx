import { useRouteError } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Exception = ({ code, msg }: { code: string; msg?: string }) => {
    const error = useRouteError();
    if (error !== null) {
        console.error(error);
    }
    return (
        <div className={cn('h-full flex items-center justify-center flex-col')}>
            <span
                className={cn(
                    'relative text-foreground first-letter:tracking-[7rem] font-bold text-[10rem] w-fit block before:absolute before:size-full before:bg-no-repeat before:bg-contain before:bg-center bg-exception before:animate-404 before:-ml-1'
                )}
            >
                {code}
            </span>
            {msg}
        </div>
    );
};

export default Exception;
