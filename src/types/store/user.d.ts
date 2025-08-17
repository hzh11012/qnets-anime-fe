import type { UserInfoRes } from '@/types';

interface UserState {
    userInfo: UserInfoRes;
    isAllowViewHentai: boolean;
    isAllowSendDanmaku: boolean;
    isAllowSendComment: boolean;
}

interface UserAction {
    updateNickname: (nickname: string) => void;
}

export { UserState, UserAction };
