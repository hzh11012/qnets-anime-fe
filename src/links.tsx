import { House, LayoutList, Link, SquarePen } from 'lucide-react';

const links = [
    {
        title: '首页',
        icon: House,
        url: '/'
    },
    {
        title: '热榜',
        icon: LayoutList,
        url: '/rank'
    },
    {
        title: '留言',
        icon: SquarePen,
        url: '/message'
    },
    {
        title: '友链',
        icon: Link,
        url: '/link'
    }
];

export { links };
