import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { UserState, UserAction } from '@/types';

const useUserStore = create(
    persist<UserState & UserAction>(
        set => ({
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
            isHentai: false,
            setUserInfo: value => {
                set(() => ({ userInfo: value }));
            },
            setIsHentai: value => {
                set(() => ({ isHentai: value }));
            }
        }),
        {
            name: 'user-store',
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export { useUserStore };
