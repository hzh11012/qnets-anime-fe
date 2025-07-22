import { useState } from 'react';
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
import { Star } from 'lucide-react';

interface FormRatingProps<TFieldValues extends FieldValues = FieldValues> {
    control: Control<TFieldValues>;
    name: Path<TFieldValues>;
    label?: string;
}

const FormRating = <TFieldValues extends FieldValues>({
    control,
    name,
    label
}: FormRatingProps<TFieldValues>) => {
    const [hoverRating, setHoverRating] = useState('');

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
                            className={cn('inline-flex gap-0')}
                            onValueChange={field.onChange}
                        >
                            {['1', '2', '3', '4', '5'].map(value => (
                                <label
                                    key={value}
                                    className={cn(
                                        'relative cursor-pointer rounded px-0.5 outline-none'
                                    )}
                                    onMouseEnter={() => setHoverRating(value)}
                                    onMouseLeave={() => setHoverRating('')}
                                >
                                    <RadioGroupItem
                                        id={value}
                                        value={value}
                                        className="sr-only"
                                    />
                                    <Star
                                        size={26}
                                        className={`transition-colors duration-200 ${
                                            (hoverRating || field.value) >=
                                            value
                                                ? 'text-orange-400'
                                                : 'text-muted-foreground'
                                        }`}
                                    />
                                </label>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default FormRating;
