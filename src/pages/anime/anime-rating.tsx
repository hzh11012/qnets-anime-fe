import React, { useState } from 'react';
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
import FormRating from '@/components/custom/form/form-rating';

interface AnimeRatingProps {
    loading: boolean;
    children: React.ReactNode;
    onSubmit: (values: FormValues, cb: () => void) => void;
}

export type FormValues = ZodFormValues<typeof schema>;

const schema = Zod.object({
    score: Zod.enum(['1', '2', '3', '4', '5'], {
        error: issue => (issue.input === undefined ? '不能为空' : '类型错误')
    }),
    content: Zod.string({
        error: issue => (issue.input === undefined ? '不能为空' : '类型错误')
    }).min(1, '不能为空')
});

const AnimeRating: React.FC<AnimeRatingProps> = ({
    loading,
    children,
    onSubmit
}) => {
    const [open, setOpen] = useState(false);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            score: undefined,
            content: ''
        }
    });

    const [score, content] = form.watch(['score', 'content']);

    const handleSubmit = (values: FormValues) => {
        onSubmit(values, () => {
            setOpen(false);
            form.reset();
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle className={cn('sm:text-left')}>
                        动漫评分
                    </DialogTitle>
                    <DialogDescription>
                        请发表你对这部作品的评分
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        className={cn('space-y-6')}
                        onSubmit={form.handleSubmit(handleSubmit)}
                    >
                        <FormRating control={form.control} name="score" />
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
                        disabled={(!score || !content) && !loading}
                        onClick={form.handleSubmit(handleSubmit)}
                    >
                        发表短评
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AnimeRating;
