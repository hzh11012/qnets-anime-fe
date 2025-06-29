import { House, LayoutList, SquareUser, Tv } from 'lucide-react';

const links = [
    {
        title: '首页',
        icon: House,
        url: '/'
    },
    {
        title: '导视',
        icon: Tv,
        url: '/guide'
    },
    {
        title: '热榜',
        icon: LayoutList,
        url: '/rank'
    },
    {
        title: '我的',
        icon: SquareUser,
        url: '/mine'
    }
];

export { links };
