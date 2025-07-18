import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { UserState, UserAction } from '@/types';

const useUserStore = create(
    persist<UserState & UserAction>(
        () => ({
            userInfo: {
                id: '',
                email: '',
                nickname: '',
                status: 0,
                avatar: '',
                permissions: [],
                createdAt: '',
                updatedAt: ''
            },
            isAllowViewHentai: false,
            isAllowSendDanmaku: false,
            isAllowSendComment: false
        }),
        {
            name: 'user-store',
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export { useUserStore };
