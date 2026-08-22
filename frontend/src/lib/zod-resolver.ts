import { FieldValues, Resolver } from "react-hook-form";
import { ZodSchema } from "zod";

export const zodResolver = <T extends FieldValues>(schema: ZodSchema): Resolver<T> => {
  return async (values) => {
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }
    const errors: Record<string, any> = {};
    result.error.errors.forEach((err) => {
      const key = err.path[0] as string;
      if (key) {
        errors[key] = {
          type: err.code,
          message: err.message,
        };
      }
    });
    return { values: {}, errors };
  };
};
