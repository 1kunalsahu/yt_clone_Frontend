import { useCallback, useState } from 'react';
import { apiError } from '../api/http.js';

export function useAsync(action) {
  const [state, setState] = useState({ loading: false, error: '', data: null });
  const run = useCallback(async (...args) => {
    setState({ loading: true, error: '', data: null });
    try {
      const data = await action(...args);
      setState({ loading: false, error: '', data });
      return data;
    } catch (error) {
      const message = apiError(error);
      setState({ loading: false, error: message, data: null });
      throw error;
    }
  }, [action]);
  return { ...state, run };
}
