import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import Favicon from '@/assets/favicon.svg?react';
import LogoSvg from '@/assets/logo.svg?react';

interface LogoProps {
    type: 'favicon' | 'logo';
    className?: string;
}

const Logo: React.FC<LogoProps> = memo(({ type, className }) => {
    return (
        <>
            {type === 'favicon' && <Favicon className={cn(className)} />}
            {type === 'logo' && <LogoSvg className={cn(className)} />}
        </>
    );
});

Logo.displayName = 'Logo';

export default Logo;
