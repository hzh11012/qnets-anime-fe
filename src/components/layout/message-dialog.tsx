import React, { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Zod from 'zod';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import type { ZodFormValues } from '@/types';
import FormTextarea from '@/components/custom/form/form-textarea';
import FormRadio from '@/components/custom/form/form-radio';
import { useSidebarStore } from '@/store';
import { useDebounceFn } from 'ahooks';

interface MessageDialogProps {
    children: React.ReactNode;
}

export type FormValues = ZodFormValues<typeof schema>;

const schema = Zod.object({
    type: Zod.enum(['0', '1', '2', '3'], {
        error: issue => (issue.input === undefined ? '不能为空' : '类型错误')
    }),
    content: Zod.string({
        error: issue => (issue.input === undefined ? '不能为空' : '类型错误')
    })
        .trim()
        .min(1, '不能为空')
});

const types = [
    { label: '咨询', value: '0' },
    { label: '建议', value: '1' },
    { label: '投诉', value: '2' },
    { label: '其他', value: '3' }
];

const MessageDialog: React.FC<MessageDialogProps> = ({ children }) => {
    const loading = useSidebarStore(state => state.message.loading);
    const fetchData = useSidebarStore(state => state.message.fetchData);

    const [open, setOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            type: '0',
            content: ''
        }
    });

    const [type, content] = form.watch(['type', 'content']);

    const { run: handleSubmit } = useDebounceFn(
        (values: FormValues) => {
            fetchData(values, () => {
                setOpen(false);
                form.reset();
            });
        },
        { wait: 200 }
    );

    const isFormValid = useMemo(() => {
        return type && content && !loading;
    }, [type, content, loading]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className={cn('sm:text-left')}>
                        平台留言
                    </DialogTitle>
                    <DialogDescription>
                        如遇影片无法播放，可能存在网络拥堵等情况，可尝试切换清晰度或刷新页面
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className={cn('space-y-6')}
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <FormRadio
                            control={form.control}
                            name="type"
                            options={types}
                        />
                        <FormTextarea
                            control={form.control}
                            name="content"
                            placeholder=""
                            maxLength={1000}
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
                        提交留言
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

MessageDialog.displayName = 'MessageDialog';

export default MessageDialog;
