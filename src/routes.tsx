import React, { memo } from 'react';
import { createBrowserRouter, Outlet, RouteObject } from 'react-router-dom';
import { useScrollReset, useUserStatusCheck } from '@/hooks';
import Layout from '@/layout';
import { getUserInfo } from '@/apis';
import { useUserStore, useAnimeStore, useTopicDetailStore } from '@/store';
import {
    checkPermission,
    shouldRevalidateRoute,
    createLazyComponent
} from '@/lib/utils';
import Fallback from '@/components/custom/fallback';
import Exception from '@/components/custom/exception';

// 环境变量
const ADMIN = import.meta.env.VITE_ADMIN;
const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;

// 认证 loader
const authLoader = async () => {
    try {
        const { data } = await getUserInfo();
        const permissions = data.permissions;

        // 权限检查
        const isAllowViewHentai = checkPermission(permissions, [
            ADMIN,
            `${CLIENT_PREFIX}:animetype_4:view`
        ]);

        const isAllowSendDanmaku = checkPermission(permissions, [
            ADMIN,
            `${CLIENT_PREFIX}:danmakus:create`
        ]);

        const isAllowSendComment = checkPermission(permissions, [
            ADMIN,
            `${CLIENT_PREFIX}:video-comments:create`
        ]);

        useUserStore.setState({
            userInfo: data,
            isAllowViewHentai,
            isAllowSendDanmaku,
            isAllowSendComment
        });

        return null;
    } catch (error) {
        throw error;
    }
};

// 基础布局组件
const BaseLayout = memo(({ children }: { children: React.ReactNode }) => {
    useScrollReset();
    const banCheck = useUserStatusCheck();

    if (banCheck) return banCheck;

    return <>{children}</>;
});

BaseLayout.displayName = 'BaseLayout';

// 视频 loader
const videoLoader = async ({ params }: { params: { id: string } }) => {
    try {
        const id = params.id;
        const state = useAnimeStore.getState();
        const fetchDetailData = state.fetchDetailData;
        await fetchDetailData(id);
        return null;
    } catch (error) {
        throw error;
    }
};

// 视频布局组件
const VideoLayout = memo(({ children }: { children: React.ReactNode }) => {
    useScrollReset();
    const banCheck = useUserStatusCheck();

    if (banCheck) return banCheck;

    const detail = useAnimeStore(state => state.detail);

    if (!detail) return <Exception type="not-found" />;

    return <>{children}</>;
});

VideoLayout.displayName = 'VideoLayout';

// 专题 loader
const topicLoader = async ({ params }: { params: { id: string } }) => {
    try {
        const id = params.id;
        const state = useTopicDetailStore.getState();
        const fetchTopicDetailData = state.fetachTopicDetail;
        await fetchTopicDetailData(id);
        return null;
    } catch (error) {
        throw error;
    }
};

// 专题布局组件
const TopicLayout = memo(({ children }: { children: React.ReactNode }) => {
    useScrollReset();
    const banCheck = useUserStatusCheck();

    if (banCheck) return banCheck;

    const topicDetail = useTopicDetailStore(state => state.detail);

    if (!topicDetail) return <Exception type="not-found" />;

    return <>{children}</>;
});

TopicLayout.displayName = 'TopicLayout';

// 路由配置
const staticRoutes: RouteObject[] = [
    {
        path: '/',
        loader: authLoader,
        shouldRevalidate: shouldRevalidateRoute,
        Component: () => (
            <BaseLayout>
                <Layout />
            </BaseLayout>
        ),
        hydrateFallbackElement: <Fallback />,
        errorElement: <Exception type="error" />,
        children: [
            {
                index: true,
                lazy: createLazyComponent(() => import('@/pages/home/index'))
            },
            {
                path: 'bangumi',
                lazy: createLazyComponent(() => import('@/pages/bangumi/index'))
            },
            {
                path: 'guide',
                lazy: createLazyComponent(() => import('@/pages/guide/index'))
            },
            {
                path: 'rank',
                lazy: createLazyComponent(() => import('@/pages/rank/index'))
            },
            {
                path: 'topic',
                lazy: createLazyComponent(() => import('@/pages/topic/index'))
            },
            {
                path: 'search',
                lazy: createLazyComponent(() => import('@/pages/search/index'))
            },
            {
                path: '*',
                element: <Exception type="not-found" />
            }
        ]
    },
    {
        path: '/topic/:id',
        loader: async (ctx: any) => {
            await topicLoader(ctx);
        },
        shouldRevalidate: shouldRevalidateRoute,
        Component: () => (
            <TopicLayout>
                <Layout />
            </TopicLayout>
        ),
        hydrateFallbackElement: <Fallback />,
        errorElement: <Exception type="error" />,
        children: [
            {
                index: true,
                lazy: createLazyComponent(
                    () => import('@/pages/topic-detail/index')
                )
            }
        ]
    },
    {
        path: '/anime/:id',
        loader: async (ctx: any) => {
            await authLoader();
            await videoLoader(ctx);
        },
        shouldRevalidate: shouldRevalidateRoute,
        Component: () => (
            <VideoLayout>
                <Outlet />
            </VideoLayout>
        ),
        hydrateFallbackElement: <Fallback />,
        errorElement: <Exception type="error" />,
        children: [
            {
                index: true,
                lazy: createLazyComponent(() => import('@/pages/anime/index'))
            }
        ]
    }
];

const router = createBrowserRouter(staticRoutes);

export default router;
