import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface FormTextareaProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    name: Path<TFieldValues>;
    label?: string;
    placeholder?: string;
    maxLength?: number;
}

const FormTextarea = <TFieldValues extends FieldValues>({
    control,
    name,
    label,
    placeholder = '请输入',
    maxLength
}: FormTextareaProps<TFieldValues>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    {label && (
                        <FormLabel className={cn('text-sm w-fit')}>
                            {label}
                        </FormLabel>
                    )}
                    <FormControl>
                        <Textarea
                            className={cn('resize-none max-h-35')}
                            autoComplete="off"
                            value={field.value}
                            onChange={field.onChange}
                            placeholder={placeholder}
                            maxLength={maxLength}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormTextarea;
