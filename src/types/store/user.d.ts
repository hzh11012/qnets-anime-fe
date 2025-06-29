import type { UserInfoRes } from '@/types';

interface UserState {
    userInfo: UserInfoRes;
    isHentai: boolean;
}

interface UserAction {
    setUserInfo: (value: UserState['userInfo']) => void;
    setIsHentai: (value: UserState['isHentai']) => void;
}

export { UserState, UserAction };
