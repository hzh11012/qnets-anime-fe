interface UserInfoRes {
    id: string;
    email: string;
    nickname: string;
    status: number;
    avatar: string | null;
    permissions: string[];
    createdAt: string;
    updatedAt: string;
}

interface EditUserParams {
    nickname: string;
}

export { UserInfoRes, EditUserParams };
