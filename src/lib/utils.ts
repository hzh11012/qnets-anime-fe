import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs));
};

const checkPermission = (
    permissions: string[],
    requiredPermissions: string[]
): boolean => {
    return requiredPermissions.some(permission =>
        permissions.includes(permission)
    );
};

// 路由验证函数
const shouldRevalidateRoute = ({
    currentUrl,
    nextUrl
}: {
    currentUrl: URL;
    nextUrl: URL;
}) => {
    return currentUrl.pathname !== nextUrl.pathname;
};

// 懒加载组件工厂函数
const createLazyComponent = (
    importFn: () => Promise<{ default: React.ComponentType }>
) => {
    return async () => ({
        Component: (await importFn()).default
    });
};

const formatDate = (datetime: string) => {
    // 确保输入是Date对象
    const date = new Date(datetime);

    // 当前日期和时间
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0); // 今天开始时间

    // 目标日期的年月日
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // 目标日期开始时间

    // 时间差（毫秒）
    const timeDiff = todayStart.getTime() - targetDate.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    // 格式化数字为两位数
    const padZero = (num: number): string => num.toString().padStart(2, '0');

    // 提取时间部分
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const timeStr = `${hours}:${minutes}`;

    // 判断日期类型
    if (timeDiff < oneDay) {
        return `今天 ${timeStr}`;
    } else if (timeDiff < 2 * oneDay) {
        return `昨天 ${timeStr}`;
    } else if (date.getFullYear() === now.getFullYear()) {
        return `${padZero(date.getMonth() + 1)}-${padZero(date.getDate())}`;
    } else {
        return `${padZero(date.getMonth() + 1)}-${padZero(date.getDate())} ${date.getFullYear()}`;
    }
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

// 生成年份选项数组
const generateYearOptions = () => {
    // 获取当前年份
    const currentYear = new Date().getFullYear();
    const options = [
        {
            label: '全部年份',
            value: ''
        }
    ];

    const tenYearsAgo = Math.floor(currentYear / 10) * 10;
    const twentyYearsAgo = Math.floor((currentYear - 30) / 5) * 5;

    let startYear = Math.floor((currentYear - 10) / 5) * 5;

    for (let i = 0; i < currentYear - startYear - 4; i++) {
        const year = currentYear - i;
        options.push({ label: `${year}`, value: `[${year},${year + 1})` });
    }

    while (startYear > twentyYearsAgo) {
        const endYear = startYear + 4;

        if (endYear <= tenYearsAgo) {
            options.push({
                label: `${endYear}-${startYear}`,
                value: `[${startYear},${endYear + 1})`
            });
        }

        startYear -= 5;
    }

    options.push({
        label: '更早',
        value: `[,${startYear + 5})`
    });

    return options;
};

export {
    cn,
    checkPermission,
    shouldRevalidateRoute,
    createLazyComponent,
    formatDate,
    formateNumber,
    getResponsiveClasses,
    formatVideoTime,
    generateYearOptions
};
