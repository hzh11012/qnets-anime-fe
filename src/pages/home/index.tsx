import React from 'react';
import Swiper from '@/pages/home/swiper';
import { useRequest } from 'ahooks';
import { getBannerList } from '@/apis/banner';
import { useHomeStore } from '@/store';
import { cn } from '@/lib/utils';

const Home: React.FC = () => {
    const setLoading = useHomeStore(state => state.setLoading);
    const setBannerList = useHomeStore(state => state.setBannerList);

    const initDate = async () => {
        const [bannerDate] = await Promise.all([getBannerList()]);

        return {
            bannerList: bannerDate.data.rows
        };
    };

    useRequest(initDate, {
        debounceWait: 250,
        onBefore: () => {
            setLoading(true);
        },
        onSuccess: data => {
            const { bannerList } = data;
            setBannerList(bannerList);
        },
        onFinally: () => {
            setLoading(false);
        }
    });

    return (
        <div className="h-[5000px]">
            <Swiper className={cn('mt-4 md:mt-6', 'transition-[margin]')} />
        </div>
    );
};

export default Home;
