import { useEffect } from 'react';
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

export { useScrollReset, useUserStatusCheck };
