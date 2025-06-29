import React from 'react';
import { Footer } from '@/components/ui/footer';
import { cn } from '@/lib/utils';
import { useMatch, useNavigate } from 'react-router-dom';
import { links } from '@/links';

const AppFooter: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Footer className={cn('justify-around')}>
            {links.map((link, index) => {
                const { title, icon: Icon, url } = link;
                const isActive = useMatch(url);
                return (
                    <div
                        key={index}
                        className={cn(
                            'flex flex-col text-xs items-center justify-center text-card-foreground cursor-pointer select-none gap-1',
                            {
                                'text-primary-foreground': isActive
                            }
                        )}
                        onClick={() => navigate(url)}
                    >
                        <Icon size={22} />
                        <span
                            className={cn(
                                'transition-colors text-muted-foreground',
                                { 'text-primary-foreground/70': isActive }
                            )}
                        >
                            {title}
                        </span>
                    </div>
                );
            })}
        </Footer>
    );
};
export default AppFooter;
