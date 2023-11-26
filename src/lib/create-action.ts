import { z } from "zod";

export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

export type ActionState<TInput, TOutput = unknown> = {
  fieldErrors?: FieldErrors<TInput>;
  error?: string | null;
  data?: TOutput;
};

export const createAction = <TInput, TOutput, Transformed>(
  schema: z.ZodType<Transformed, any, TInput>,
  handler: (
    valiadatedData: Transformed,
    identifiers: Record<string, string>
  ) => Promise<ActionState<TInput, TOutput>>
) => {
  return async (
    data: TInput,
    identifiers: Record<string, string>
  ): Promise<ActionState<Transformed | TInput, TOutput>> => {
    const validationResult = schema.safeParse(data);

    if (!validationResult.success) {
      const fieldErrors: { [key: string]: string[] } = {};

      validationResult.error.issues.forEach((issue) => {
        // Create the dot-joined path as a key
        const key = issue.path.map(String).join(".");
        // Ensure there is an array to push the message into
        if (!fieldErrors[key]) {
          fieldErrors[key] = [];
        }
        // Add the error message to the array
        fieldErrors[key].push(issue.message);
      });

      return { fieldErrors: fieldErrors as FieldErrors<TInput> };
    }

    return handler(
      validationResult.data as unknown as Transformed,
      identifiers
    );
  };
};
