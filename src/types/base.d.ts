import Zod, { ZodType } from 'zod';

type ZodFormValues<T extends ZodType> = Zod.infer<T>;

interface Option {
    label: string;
    value: string;
}

export { ZodFormValues, Option };
