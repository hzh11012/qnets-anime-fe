import { HttpClient, AuthClient } from '@/lib/request';
import type { UserInfoRes } from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}`;

const getUserInfo = () => {
    return HttpClient.get<UserInfoRes>(`${prefix}/users/me`);
};

const logout = () => {
    return AuthClient.post('/api/sso/logout');
};

export { getUserInfo, logout };
