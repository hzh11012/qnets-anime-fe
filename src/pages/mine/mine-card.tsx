import React, { memo } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import FailAvatar from '@/components/custom/fail-avatar';
import { Button } from '@/components/ui/button';
import { LogOut, PencilLine } from 'lucide-react';
import UserDialog from '@/pages/mine/user-dialog';

interface AnimeRankHeaderProps {
    nickName: string;
    avatar: string | null;
    email: string;
}

const MineCard: React.FC<AnimeRankHeaderProps> = memo(
    ({ nickName, email, avatar }) => {
        return (
            <div
                className={cn(
                    'flex items-center shrink-0 justify-between h-28 md:h-32 bg-card rounded-sm px-4 md:px-8 select-none',
                    'transition-[height,padding] duration-200'
                )}
            >
                <div className={cn('flex-1 flex items-center gap-4 mr-4')}>
                    <Avatar className={cn('size-16')}>
                        <AvatarImage src={avatar || ''} alt={nickName} />
                        <AvatarFallback>
                            <FailAvatar />
                        </AvatarFallback>
                    </Avatar>
                    <div className={cn('h-14 flex flex-col justify-between')}>
                        <div className={cn('flex items-center gap-2')}>
                            <div
                                className={cn(
                                    'items-center text-lg font-bold break-all line-clamp-1'
                                )}
                            >
                                {nickName}
                            </div>
                            <UserDialog>
                                <PencilLine className="size-5 shrink-0 cursor-pointer text-primary" />
                            </UserDialog>
                        </div>
                        <div
                            className={cn(
                                'text-sm text-muted-foreground break-all line-clamp-1'
                            )}
                        >
                            {email}
                        </div>
                    </div>
                </div>
                <div className={cn('flex items-center gap-4')}>
                    <Button variant="link" size="icon" title="退出">
                        <LogOut className="size-5" />
                    </Button>
                </div>
            </div>
        );
    }
);

MineCard.displayName = 'MineCard';

export default MineCard;
