import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Zod from 'zod';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { ZodFormValues } from '@/types';
import { useUserStore, useMineStore } from '@/store';
import { useDebounceFn } from 'ahooks';
import FormInput from '@/components/custom/form/form-input';

interface UserDialogProps {
    children: React.ReactNode;
}

export type FormValues = ZodFormValues<typeof schema>;

const schema = Zod.object({
    nickname: Zod.string({
        error: issue => (issue.input === undefined ? '不能为空' : '类型错误')
    })
        .trim()
        .min(1, '不能为空')
});

const UserDialog: React.FC<UserDialogProps> = ({ children }) => {
    const loading = useMineStore(state => state.user.loading);
    const _nickname = useUserStore(state => state.userInfo.nickname);
    const updateNickname = useUserStore(state => state.updateNickname);
    const fetchData = useMineStore(state => state.user.fetchData);

    const [open, setOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            nickname: _nickname
        }
    });

    const [nickname] = form.watch(['nickname']);

    const { run: handleSubmit } = useDebounceFn(
        (values: FormValues) => {
            fetchData(values, () => {
                setOpen(false);
                form.setValue('nickname', values.nickname);
                updateNickname(values.nickname);
            });
        },
        { wait: 200 }
    );

    const isFormValid = useMemo(() => {
        return nickname && !loading;
    }, [nickname, loading]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle className={cn('sm:text-left')}>
                        修改昵称
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className={cn('space-y-6')}
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <FormInput
                            control={form.control}
                            name="nickname"
                            placeholder=""
                            maxLength={25}
                        />
                    </form>
                </Form>
                <DialogFooter className={cn('flex-row gap-5')}>
                    <Button
                        variant="default"
                        className={'h-9 flex-1'}
                        disabled={!isFormValid}
                        onClick={form.handleSubmit(handleSubmit)}
                    >
                        提交昵称
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

UserDialog.displayName = 'UserDialog';

export default UserDialog;
