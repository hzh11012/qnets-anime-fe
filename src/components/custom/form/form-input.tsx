import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { Control, FieldValues, Path } from 'react-hook-form';

interface FormInputProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    name: Path<TFieldValues>;
    label?: string;
    placeholder?: string;
    maxLength?: number;
}

const FormInput = <TFieldValues extends FieldValues>({
    control,
    name,
    label,
    placeholder = '请输入',
    maxLength
}: FormInputProps<TFieldValues>) => {
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
                        <Input
                            type="text"
                            autoComplete="off"
                            value={field.value}
                            maxLength={maxLength}
                            onChange={field.onChange}
                            placeholder={placeholder}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormInput;
