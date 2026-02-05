import { FieldHookConfig, useField, useFormikContext } from "formik";
import { useMemo } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useFixedField<Value = any>(
  config: string | FieldHookConfig<Value>,
) {
  const [field, meta] = useField<Value>(config);
  const { setFieldTouched, setFieldValue, setFieldError } = useFormikContext();
  const helpers = useMemo(
    () => ({
      setValue: (val: Value) => setFieldValue(field.name, val),
      setTouched: (touched: boolean) => setFieldValue(field.name, touched),
      setError: (error: string) => setFieldValue(field.name, error),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setFieldValue, field.name, setFieldTouched, setFieldError],
  );
  return [field, meta, helpers] as const;
}
