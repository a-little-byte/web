import { type HttpCode, PublicError } from "@/errors";
import { useRouter } from "@/lib/i18n/routing";
import {
  UndefinedInitialDataOptions,
  useQuery as useQueryBase,
} from "@tanstack/react-query";
import {
  ClientRequestOptions,
  ClientResponse,
  InferRequestType,
  InferResponseType,
} from "hono/client";

export const useQuery = <
  T extends {
    $get:
      | ((
          args: any,
          options?: ClientRequestOptions,
        ) => Promise<ClientResponse<any, number, "json">>)
      | ((
          args?: object,
          options?: ClientRequestOptions,
        ) => Promise<ClientResponse<any, number, "json">>);
    $url: (args?: any) => URL;
  },
>(
  request: T,
  args?: InferRequestType<T["$get"]>,
  options?: Omit<
    UndefinedInitialDataOptions<InferResponseType<T["$get"]>, PublicError>,
    "queryKey" | "queryFn"
  >,
) => {
  const router = useRouter();
  return useQueryBase<
    Exclude<InferResponseType<T["$get"]>, { error: unknown }>,
    PublicError
  >({
    queryKey: [request.$url().toString(), args],
    queryFn: async () => {
      const token = document.cookie.replace(
        /(?:(?:^|.*;\s*)auth-token\s*\=\s*([^;]*).*$)|^.*$/,
        "$1",
      );

      const response = await request.$get(args, {
        ...(token.length > 0 && {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      });

      if (response.ok) {
        return response.json() as Promise<
          Exclude<InferResponseType<T["$get"]>, { error: unknown }>
        >;
      }

      if (response.status === 401) {
        router.push("/auth/login");
      }

      const { error } = await response.json();

      throw new PublicError(error.message, response.status as HttpCode);
    },
    ...options,
  });
};
