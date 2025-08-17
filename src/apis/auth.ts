import { HttpClient, AuthClient } from '@/lib/request';
import type { UserInfoRes, EditUserParams } from '@/types';

const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;
const prefix = `/api/${CLIENT_PREFIX}`;

const getUserInfo = () => {
    return HttpClient.get<UserInfoRes>(`${prefix}/users/me`);
};

const userEdit = (params: EditUserParams) => {
    return HttpClient.patch(`${prefix}/users`, params);
};

const logout = () => {
    return AuthClient.post('/api/sso/logout');
};

export { getUserInfo, userEdit, logout };
