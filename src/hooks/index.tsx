import { useEffect, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { useUserStore } from '@/store';
import Exception from '@/components/custom/exception';

// 滚动重置 Hook
const useScrollReset = () => {
    const location = useLocation();
    const navigationType = useNavigationType();

    useEffect(() => {
        // 仅在新导航时重置滚动（排除回退/前进）
        if (navigationType === 'PUSH') {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, navigationType]);
};

// 用户状态检查 Hook
const useUserStatusCheck = () => {
    const userInfo = useUserStore(state => state.userInfo);

    if (userInfo?.status === 0) {
        return <Exception type="ban" />;
    }

    return null;
};

const useMediaQuery = (query: string) => {
    const [value, setValue] = useState(false);

    useEffect(() => {
        function onChange(event: MediaQueryListEvent) {
            setValue(event.matches);
        }

        const result = matchMedia(query);
        result.addEventListener('change', onChange);
        setValue(result.matches);

        return () => result.removeEventListener('change', onChange);
    }, [query]);

    return value;
};

export { useScrollReset, useUserStatusCheck, useMediaQuery };
