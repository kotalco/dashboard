import { useCallback, useState } from "react";

import { ActionState, FieldErrors } from "@/lib/create-action";

export type Action<TInput, TOutput> = (
  data: TInput,
  indentifiers: Record<string, string>
) => Promise<ActionState<TInput, TOutput>>;

interface UseActionOptions<TOutput> {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onComplete?: ({ data, error }: { data?: TOutput; error?: string }) => void;
}

export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options: UseActionOptions<TOutput> = {}
) => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput>>();
  const [error, setError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [data, setData] = useState<TOutput>();
  const [isLoading, setIsLoading] = useState(false);

  const execute = useCallback(
    async (input: TInput, identifiers?: any) => {
      setError(undefined);
      setIsLoading(true);
      setSuccess(false);
      const finalResult: { data?: TOutput; error?: string } = {
        data: undefined,
        error: undefined,
      };

      try {
        const result = await action(input, identifiers);

        if (!result) {
          return;
        }

        setFieldErrors(result.fieldErrors);

        if (result.error) {
          setError(result.error);
          options.onError?.(result.error);
        }

        if (result.data) {
          setData(result.data);
          setSuccess(true);
          options.onSuccess?.(result.data);
        }
        finalResult.data = result.data;
        finalResult.error = result.error;
      } finally {
        setIsLoading(false);
        options.onComplete?.(finalResult);
      }
    },
    [action, options]
  );

  return { execute, fieldErrors, success, error, data, isLoading };
};
