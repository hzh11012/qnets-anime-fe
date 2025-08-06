import React, { memo } from 'react';
import { cn } from '@/lib/utils';

interface FailAvatarProps {
    className?: string;
}

const FailAvatar: React.FC<FailAvatarProps> = memo(({ className }) => {
    return (
        <div
            className={cn('size-full bg-fail-avatar bg-cover', className)}
        ></div>
    );
});

FailAvatar.displayName = 'FailAvatar';

export default FailAvatar;
