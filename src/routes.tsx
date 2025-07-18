import { createBrowserRouter, Outlet, RouteObject } from 'react-router-dom';
import Loading from '@/components/custom/loading';
import Error from '@/components/custom/error';
import { getUserInfo } from '@/apis';
import { useUserStore, useAnimeStore } from '@/store';
import Layout from '@/layout';
import Exception from '@/components/custom/exception';

const ADMIN = import.meta.env.VITE_ADMIN;
const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;

// 认证 loader
const authLoader = async () => {
    const { data } = await getUserInfo();
    const permissions = data.permissions;
    // 是否允许查询里番
    const isAllowViewHentai = [ADMIN, `${CLIENT_PREFIX}:animetype_4:view`].some(
        p => permissions.includes(p)
    );
    // 是否允许发弹幕
    const isAllowSendDanmaku = [ADMIN, `${CLIENT_PREFIX}:danmakus:create`].some(
        p => permissions.includes(p)
    );

    // 是否允许发评论
    const isAllowSendComment = [
        ADMIN,
        `${CLIENT_PREFIX}:video-comments:create`
    ].some(p => permissions.includes(p));

    useUserStore.setState({
        userInfo: data,
        isAllowViewHentai,
        isAllowSendDanmaku,
        isAllowSendComment
    });
    return null;
};

const WithLayout = ({ children }: { children: React.ReactNode }) => {
    const userInfo = useUserStore(state => state.userInfo);
    if (userInfo?.status === 0) {
        return <Exception code="43" msg="账号未开通/已封禁" />;
    }
    return <>{children}</>;
};

// 视频 loader
const videoLoader = async ({ params }: { params: { id: string } }) => {
    const id = params.id;

    const state = useAnimeStore.getState();
    const fetchAnimeDetailData = state.fetchAnimeDetailData;
    await fetchAnimeDetailData(id);

    return null;
};

const WithVideoLayout = ({ children }: { children: React.ReactNode }) => {
    const userInfo = useUserStore(state => state.userInfo);
    if (userInfo?.status === 0) {
        return <Exception code="43" msg="账号未开通/已封禁" />;
    }

    const animeDetail = useAnimeStore(state => state.animeDetail);
    if (!animeDetail) {
        return <Exception code="44" />;
    }
    return <>{children}</>;
};

const staticRoutes: RouteObject[] = [
    {
        path: '/',
        loader: authLoader,
        Component: () => (
            <WithLayout>
                <Layout />
            </WithLayout>
        ),
        hydrateFallbackElement: <Loading />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                lazy: async () => ({
                    Component: (await import('@/pages/home/index')).default
                })
            },
            {
                path: '*',
                element: <Exception code="44" />
            }
        ]
    },
    {
        path: '/anime/:id',
        loader: async (ctx: any) => {
            await authLoader();
            await videoLoader(ctx);
        },
        element: (
            <WithVideoLayout>
                <Outlet />
            </WithVideoLayout>
        ),
        hydrateFallbackElement: <Loading />,
        errorElement: <Error />,
        children: [
            {
                index: true,
                lazy: async () => ({
                    Component: (await import('@/pages/anime/index')).default
                })
            }
        ]
    }
];

const router = createBrowserRouter(staticRoutes as RouteObject[]);

export default router;
