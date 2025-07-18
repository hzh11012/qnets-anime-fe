import Zod, { ZodType } from 'zod';

type ZodFormValues<T extends ZodType> = Zod.infer<T>;

export { ZodFormValues };
