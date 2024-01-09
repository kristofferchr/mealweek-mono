import { ApiClient } from "./ApiClient";
import { useCallback, useState } from "react";


type ExtractPromiseReturnType<T extends (...args: any) => any> =
  ReturnType<T> extends Promise<infer U> ? U : T;

// noinspection JSAnnotator
type UseClientState<T extends (...args: any) => any> = [
  doRequest: (...args: Parameters<T>) => Promise<ExtractPromiseReturnType<T>>,
  loading: boolean,
  response: ExtractPromiseReturnType<T> | undefined,
  reset: () => void
];

export function useClient<P extends keyof ApiClient, T extends ApiClient[P]>(
  key: P
): UseClientState<T> {
  const [client] = useState(new ApiClient());
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ExtractPromiseReturnType<T>>();

  // noinspection JSAnnotator
    const doRequest = useCallback(
    async (...args: Parameters<T>): Promise<ExtractPromiseReturnType<T>> => {
      setLoading(true);
      const res = await (client[key] as any)(...args);
      setResponse(res);
      setLoading(false);
      return res;
    },
    [client, key]
  );

  const reset = useCallback(() => setResponse(undefined), [setResponse]);

  return [doRequest, loading, response, reset];
}
