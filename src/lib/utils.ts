import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DateTime } from 'luxon';

const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

const formatDate = (date: string) => {
    return DateTime.fromISO(date).toFormat('DD tt');
};

const formateNumber = (x: number) => {
    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
};

const getResponsiveClasses = (
    index: number,
    type: 'vertical' | 'horizontal'
): string => {
    const baseClasses = 'max-md:block';
    const breakpoints =
        type === 'vertical'
            ? {
                  'max-[855px]': 3,
                  'max-[1100px]': 4,
                  'max-[1300px]': 5,
                  'max-[1500px]': 6
              }
            : {
                  'max-[855px]': 2,
                  'max-[1140px]': 3,
                  'max-[1500px]': 4
              };

    const conditionalClasses = Object.entries(breakpoints)
        .filter(([, threshold]) => index >= threshold)
        .map(([className]) => `${className}:hidden`);

    return cn(baseClasses, ...conditionalClasses);
};

export { cn, formatDate, formateNumber, getResponsiveClasses };
