import { createBrowserRouter, RouteObject } from 'react-router-dom';
import Loading from '@/components/custom/loading';
import Error from '@/components/custom/error';
import { getUserInfo } from '@/apis';
import { useUserStore } from '@/store';
import Layout from '@/layout';
import Exception from '@/components/custom/exception';

const ADMIN = import.meta.env.VITE_ADMIN;
const CLIENT_PREFIX = import.meta.env.VITE_CLIENT_PREFIX;

// 认证 loader
const authLoader = async () => {
    const { data } = await getUserInfo();
    const permissions = data.permissions;
    // 是否允许查询里番
    const isAllowAnimeType4 = [ADMIN, `${CLIENT_PREFIX}:animetype_4:view`].some(
        p => permissions.includes(p)
    );

    useUserStore.setState({ userInfo: data, isHentai: isAllowAnimeType4 });
    return null;
};

const WithLayout = ({ children }: { children: React.ReactNode }) => {
    const userInfo = useUserStore(state => state.userInfo);
    if (userInfo?.status === 0) {
        return <Exception code="43" msg="账号未开通/已封禁" />;
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
    }
];

const router = createBrowserRouter(staticRoutes as RouteObject[]);

export default router;
