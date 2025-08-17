import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { MessageCirclePlus } from 'lucide-react';
import ThemeSwitch from '@/components/custom/theme-switch';
import MessageDialog from '@/components/layout/message-dialog';

interface SettingCardProps {
    className?: string;
}

const SettingCard: React.FC<SettingCardProps> = memo(({ className }) => {
    return (
        <div
            className={cn(
                'fixed z-15 right-4 bottom-21 flex md:hidden flex-col gap-2 select-none',
                className
            )}
        >
            <MessageDialog>
                <div className="bg-card size-9 rounded-sm flex items-center justify-center">
                    <MessageCirclePlus size={22} />
                </div>
            </MessageDialog>
            <ThemeSwitch className="bg-card size-9 rounded-sm flex items-center justify-center" />
        </div>
    );
});

SettingCard.displayName = 'SettingCard';

export default SettingCard;
