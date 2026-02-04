import { useRef, useCallback, useEffect } from "react";
import { FormikProps } from "formik";
import { RecipeFormValues } from "../interfaces";
import { MAX_HISTORY_SIZE } from "../constants";

export function useFormHistory(formik: FormikProps<RecipeFormValues>) {
  const historyRef = useRef<RecipeFormValues[]>([formik.values]);
  const historyIndexRef = useRef(0);
  const isUndoRedoRef = useRef(false);
  const lastValuesRef = useRef<string>(JSON.stringify(formik.values));

  // Track changes for history
  useEffect(() => {
    const currentJson = JSON.stringify(formik.values);
    if (!isUndoRedoRef.current && currentJson !== lastValuesRef.current) {
      // Remove any redo history
      historyRef.current = historyRef.current.slice(
        0,
        historyIndexRef.current + 1,
      );
      historyRef.current.push(formik.values);
      historyIndexRef.current = historyRef.current.length - 1;

      // Limit history size
      if (historyRef.current.length > MAX_HISTORY_SIZE) {
        historyRef.current.shift();
        historyIndexRef.current--;
      }
      lastValuesRef.current = currentJson;
    }
  }, [formik.values]);

  const handleUndo = useCallback(() => {
    if (historyIndexRef.current > 0) {
      isUndoRedoRef.current = true;
      historyIndexRef.current--;
      formik.setValues(historyRef.current[historyIndexRef.current]);
      lastValuesRef.current = JSON.stringify(
        historyRef.current[historyIndexRef.current],
      );
      setTimeout(() => {
        isUndoRedoRef.current = false;
      }, 0);
    }
  }, [formik]);

  const handleRedo = useCallback(() => {
    if (historyIndexRef.current < historyRef.current.length - 1) {
      isUndoRedoRef.current = true;
      historyIndexRef.current++;
      formik.setValues(historyRef.current[historyIndexRef.current]);
      lastValuesRef.current = JSON.stringify(
        historyRef.current[historyIndexRef.current],
      );
      setTimeout(() => {
        isUndoRedoRef.current = false;
      }, 0);
    }
  }, [formik]);

  // Reset history when form is reset with new values (e.g., edit mode loaded)
  const resetHistory = useCallback((values: RecipeFormValues) => {
    historyRef.current = [values];
    historyIndexRef.current = 0;
    lastValuesRef.current = JSON.stringify(values);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "y") {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  return { handleUndo, handleRedo, resetHistory };
}
