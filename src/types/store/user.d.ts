import type { UserInfoRes } from '@/types';

interface UserState {
    userInfo: UserInfoRes;
}

interface UserAction {
    setUserInfo: (value: UserState['userInfo']) => void;
}

export { UserState, UserAction };
