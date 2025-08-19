import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { UserState, UserAction } from '@/types';
import { logout } from '@/apis';

const useUserStore = create<UserState & UserAction>()(
    persist(
        immer(set => ({
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
            isAllowSendComment: false,

            updateNickname: nickname => {
                set(state => {
                    state.userInfo.nickname = nickname;
                });
            },

            logout: async () => {
                await logout();
                window.location.reload();
            }
        })),
        {
            name: 'user-store',
            storage: createJSONStorage(() => localStorage)
        }
    )
);

export { useUserStore };
