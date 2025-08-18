import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import type { Control, FieldValues, Path } from 'react-hook-form';
import type { Option } from '@/types';

interface FormRatingProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    name: Path<TFieldValues>;
    label?: string;
    options: Option[];
}

const FormRadio = <TFieldValues extends FieldValues>({
    control,
    name,
    label,
    options = []
}: FormRatingProps<TFieldValues>) => {
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
                        <RadioGroup
                            className={cn('flex gap-4')}
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                        >
                            {options.map(item => (
                                <FormItem
                                    key={item.value}
                                    className="flex items-center gap-2"
                                >
                                    <FormControl>
                                        <RadioGroupItem value={item.value} />
                                    </FormControl>
                                    <FormLabel
                                        className={cn('text-card-foreground')}
                                    >
                                        {item.label}
                                    </FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormRadio;
