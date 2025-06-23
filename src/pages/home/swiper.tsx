import React, { useRef } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';
import { useHomeStore } from '@/store';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

interface SwiperProps {
    className?: string;
    list?: SwiperItemProps[];
}

interface SwiperItemProps {
    onClick: () => void;
    title: string;
    subTitle?: string;
    image: string;
    loading: boolean;
}

const SwiperItem: React.FC<SwiperItemProps> = ({
    title,
    subTitle,
    image,
    loading,
    onClick
}) => {
    return (
        <CarouselItem className={cn('pl-0')}>
            {loading ? (
                <Skeleton
                    className={cn(
                        'relative aspect-[16/9] w-full h-full max-h-[500px]'
                    )}
                />
            ) : (
                <div
                    className={cn(
                        'relative aspect-[16/9] w-full h-full max-h-[500px] bg-center bg-cover bg-no-repeat'
                    )}
                    style={{
                        backgroundImage: `url("${image}")`
                    }}
                >
                    <div
                        className={cn(
                            'absolute bg-neutral-800/80 flex items-center right-2 bottom-2 z-10 h-10 rounded-full',
                            'transition-[right,bottom,height]',
                            'md:right-8 md:bottom-8 md:h-12'
                        )}
                    >
                        <div
                            className={cn(
                                'flex items-center justify-center size-9 rounded-full absolute left-0.5 cursor-pointer bg-primary/80',
                                'transition-[scale]',
                                'md:size-11',
                                'hover:scale-120'
                            )}
                            onClick={onClick}
                        >
                            <Play color="#fff" fill="#fff" size={20} />
                        </div>
                        <div
                            className={cn(
                                'flex items-center ml-12 mr-4 gap-3 cursor-pointer text-white select-none',
                                'transition-[color]',
                                'md:ml-15',
                                'hover:text-primary-foreground'
                            )}
                            onClick={onClick}
                        >
                            <span
                                className={cn(
                                    'max-w-40 md:max-w-80 line-clamp-1',
                                    'transition-[max-width]'
                                )}
                                title={title}
                            >
                                {title}
                            </span>
                            {subTitle && (
                                <span className={cn('text-sm')}>
                                    {subTitle}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </CarouselItem>
    );
};

const Swiper: React.FC<SwiperProps> = ({ className }) => {
    const loading = useHomeStore(state => state.loading);
    const list = useHomeStore(state => state.bannerList);
    const navigate = useNavigate();

    const plugin = useRef(
        Autoplay({
            delay: 8000,
            stopOnMouseEnter: true,
            stopOnInteraction: false
        })
    );

    return (
        <Carousel
            className={cn(className)}
            opts={{ loop: true, watchDrag: false }}
            plugins={[plugin.current]}
        >
            <CarouselContent className={cn('ml-0')}>
                {list.map((item, index) => {
                    const { id, name, bannerUrl, status, videoCount } = item;

                    let subTitle = '即将上线';

                    if (videoCount) {
                        if (status === 1) {
                            subTitle = `第${videoCount}话`;
                        } else if (status === 2) {
                            subTitle = `全${videoCount}话`;
                        }
                    }

                    return (
                        <SwiperItem
                            key={index}
                            loading={loading}
                            title={name}
                            subTitle={subTitle}
                            image={bannerUrl}
                            onClick={() => {
                                if (status === 0 || !videoCount) return;
                                navigate(`/detail/${id}`);
                            }}
                        />
                    );
                })}
            </CarouselContent>
        </Carousel>
    );
};

export default Swiper;
