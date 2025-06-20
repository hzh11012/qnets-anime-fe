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

export { cn, formatDate, formateNumber };
