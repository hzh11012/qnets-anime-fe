import React, { useRef, useMemo, useCallback } from 'react';
import {
    Carousel,
    CarouselContent,
    CarouselItem
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { Play } from 'lucide-react';
import type { BannerOption } from '@/types';

interface AnimeBannerProps {
    list: BannerOption[];
    onClick: (id: string) => void;
    className?: string;
}

interface AnimeBannerItemProps {
    title: string;
    subTitle?: string;
    image: string;
    onClick: () => void;
}

const AnimeBannerItem: React.FC<AnimeBannerItemProps> = ({
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
                        'transition-[right,bottom,height] duration-200',
                        'md:right-8 md:bottom-8 md:h-12'
                    )}
                >
                    <div
                        className={cn(
                            'flex items-center justify-center size-9 rounded-full absolute left-0.5 cursor-pointer bg-primary/80',
                            'transition-[scale] duration-200',
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
                            'transition-[color] duration-200',
                            'md:ml-15',
                            'hover:text-primary-foreground'
                        )}
                        onClick={onClick}
                    >
                        <span
                            className={cn(
                                'max-w-40 md:max-w-80 line-clamp-1',
                                'transition-[max-width] duration-200'
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

const AnimeBanner: React.FC<AnimeBannerProps> = ({
    list,
    onClick,
    className
}) => {
    if (!list?.length) return null;

    const handleClick = (id: string) => onClick(id);

    const getSubTitle = useCallback((item: BannerOption) => {
        const { videoCount, status } = item;

        if (!videoCount) return '即将开播';

        if (status === 1) {
            return `更新至第${videoCount}话`;
        } else if (status === 2) {
            return `全${videoCount}话`;
        }

        return '即将开播';
    }, []);

    const plugin = useRef(
        Autoplay({
            delay: 8000,
            stopOnMouseEnter: true,
            stopOnInteraction: false
        })
    );

    const carouselItems = useMemo(() => {
        return list.map((item, index) => {
            const { id, name, bannerUrl, videoId = '' } = item;

            return (
                <AnimeBannerItem
                    key={`${id}-${index}`}
                    title={name}
                    subTitle={getSubTitle(item)}
                    image={bannerUrl}
                    onClick={() => handleClick(videoId)}
                />
            );
        });
    }, [list]);

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

export default AnimeBanner;
