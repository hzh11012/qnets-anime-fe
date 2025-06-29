import React, { useRef, useMemo, useCallback } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';
import { BannerOption } from '@/types';

interface SwiperProps {
    list: BannerOption[];
    onClick: (id: string) => void;
    className?: string;
}

interface SwiperItemProps {
    title: string;
    subTitle?: string;
    image: string;
    onClick: () => void;
}

const SwiperItem: React.FC<SwiperItemProps> = ({
    title,
    subTitle,
    image,
    onClick
}) => {
    return (
        <CarouselItem className={cn('pl-0')}>
            <div
                className={cn(
                    'relative aspect-[16/9] w-full h-full max-h-[600px] bg-center bg-cover bg-no-repeat'
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
                            <span className={cn('text-sm')}>{subTitle}</span>
                        )}
                    </div>
                </div>
            </div>
        </CarouselItem>
    );
};

const Swiper: React.FC<SwiperProps> = ({ list, onClick, className }) => {
    if (!list?.length) return null;

    const handleClick = useCallback(
        (id: string) => {
            onClick(id);
        },
        [onClick]
    );

    const plugin = useRef(
        Autoplay({
            delay: 8000,
            stopOnMouseEnter: true,
            stopOnInteraction: false
        })
    );

    const carouselItems = useMemo(() => {
        return list.map((item, index) => {
            const { id, name, bannerUrl, status, videoCount } = item;

            // 优化副标题逻辑
            const getSubTitle = () => {
                if (!videoCount) return '即将开播';

                switch (status) {
                    case 1:
                        return `第${videoCount}话`;
                    case 2:
                        return `全${videoCount}话`;
                    default:
                        return '即将开播';
                }
            };

            return (
                <SwiperItem
                    key={`${id}-${index}`}
                    title={name}
                    subTitle={getSubTitle()}
                    image={bannerUrl}
                    onClick={() => handleClick(id)}
                />
            );
        });
    }, [list, handleClick]);

    return (
        <Carousel
            className={cn('w-full', className)}
            opts={{ loop: true, watchDrag: false }}
            plugins={[plugin.current]}
        >
            <CarouselContent className={cn('ml-0')}>
                {carouselItems}
            </CarouselContent>
        </Carousel>
    );
};

export default Swiper;
