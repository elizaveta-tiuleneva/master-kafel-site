import { useCallback, useEffect, useState } from "react";

/**
 * Загрузка данных с состояниями loading / error и повтором.
 * loader должен быть стабильным (useCallback) — при его смене запрос повторяется.
 */
export function useAsync(loader) {
  const [state, setState] = useState({ data: null, error: null, loading: true });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((current) => ({ ...current, loading: true, error: null }));
    loader()
      .then((data) => {
        if (!cancelled) setState({ data, error: null, loading: false });
      })
      .catch((error) => {
        if (!cancelled) setState({ data: null, error, loading: false });
      });
    return () => {
      cancelled = true;
    };
  }, [loader, attempt]);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);
  return { ...state, reload };
}
