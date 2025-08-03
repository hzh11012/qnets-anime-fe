import React, { useEffect } from 'react';
import {
    createBrowserRouter,
    Outlet,
    RouteObject,
    useLocation,
    useNavigationType
} from 'react-router-dom';
import Fallback from '@/components/custom/fallback';
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
    const location = useLocation();
    const navigationType = useNavigationType();
    useEffect(() => {
        // 仅在新导航时重置滚动（排除回退/前进）
        if (navigationType === 'PUSH') {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, navigationType]);

    const userInfo = useUserStore(state => state.userInfo);
    if (userInfo?.status === 0) {
        return <Exception type="ban" />;
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
    const location = useLocation();
    const navigationType = useNavigationType();
    useEffect(() => {
        // 仅在新导航时重置滚动（排除回退/前进）
        if (navigationType === 'PUSH') {
            window.scrollTo(0, 0);
        }
    }, [location.pathname, navigationType]);

    const userInfo = useUserStore(state => state.userInfo);
    if (userInfo?.status === 0) {
        return <Exception type="ban" />;
    }

    const animeDetail = useAnimeStore(state => state.animeDetail);
    if (!animeDetail) {
        return <Exception type="not-found" />;
    }
    return <>{children}</>;
};

const staticRoutes: RouteObject[] = [
    {
        path: '/',
        loader: authLoader,
        shouldRevalidate: ({ currentUrl, nextUrl }) => {
            // 仅当路径变化时重新验证
            return currentUrl.pathname !== nextUrl.pathname;
        },
        Component: () => (
            <WithLayout>
                <Layout />
            </WithLayout>
        ),
        hydrateFallbackElement: <Fallback />,
        errorElement: <Exception type="error" />,
        children: [
            {
                index: true,
                lazy: async () => ({
                    Component: (await import('@/pages/home/index')).default
                })
            },
            {
                path: 'bangumi',
                index: true,
                lazy: async () => ({
                    Component: (await import('@/pages/bangumi/index')).default
                })
            },
            {
                path: 'guide',
                index: true,
                lazy: async () => ({
                    Component: (await import('@/pages/guide/index')).default
                })
            },
            {
                path: 'rank',
                index: true,
                lazy: async () => ({
                    Component: (await import('@/pages/rank/index')).default
                })
            },
            {
                path: '*',
                element: <Exception type="not-found" />
            }
        ]
    },
    {
        path: '/anime/:id',
        loader: async (ctx: any) => {
            await authLoader();
            await videoLoader(ctx);
        },
        shouldRevalidate: ({ currentUrl, nextUrl }) => {
            // 仅当路径变化时重新验证
            return currentUrl.pathname !== nextUrl.pathname;
        },
        element: (
            <WithVideoLayout>
                <Outlet />
            </WithVideoLayout>
        ),
        hydrateFallbackElement: <Fallback />,
        errorElement: <Exception type="error" />,
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
