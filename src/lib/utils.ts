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

const formatVideoTime = (time: number) => {
    // 处理无效输入，确保为非负数
    const _time = Math.max(0, Math.floor(time));

    // 计算时间分量
    const hours = Math.floor(_time / 3600);
    const minutes = Math.floor((_time % 3600) / 60);
    const seconds = _time % 60;

    // 格式化所有部分为两位数
    const formattedSeconds = seconds.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');

    if (hours > 0) {
        // 格式化小时为两位数
        const formattedHours = hours.toString().padStart(2, '0');
        return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
    } else {
        // 分钟部分也补零
        return `${formattedMinutes}:${formattedSeconds}`;
    }
};

export { cn, formatDate, formateNumber, getResponsiveClasses, formatVideoTime };
