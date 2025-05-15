'use client';

import {
  useQuery,
  useMutation,
  useInfiniteQuery,
  QueryKey,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import type { AxiosRequestConfig } from 'axios';
import { api } from '@/lib/axios';

export interface InfinitePage<T> {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
  emptyMessage: string | null;
  content: T[];
  nextPage?: number;
}

/**
 * 일반 GET 요청 훅
 */
export function useApiQuery<TData>(
  key: QueryKey,
  url: string,
  params?: Record<string, unknown>,
  options?: Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'>
) {
  return useQuery<TData>({
    queryKey: key,
    queryFn: () => api.get<TData>(url, { params }).then(res => res.data),
    ...options,
  });
}

/**
 * POST / PUT / DELETE 등 변이 요청 훅
 */
export function useApiMutation<TData, TVariables = unknown>(
  url: string,
  method: 'post' | 'put' | 'delete' | 'patch',
  options?: Omit<UseMutationOptions<TData, unknown, TVariables>, 'mutationFn'>
) {
  return useMutation<TData, unknown, TVariables>({
    mutationFn: variables =>
      api
        .request<TData>({ url, method, data: variables } as AxiosRequestConfig)
        .then(res => res.data),
    ...options,
  });
}

/*
 * 무한스크롤
 */
// export function useApiInfinite<T>(
//   key: QueryKey,
//   url: string,
//   params: { size: number; sort: string }
// ) {
//   return useInfiniteQuery<InfinitePage<T>, Error>({
//     queryKey: key,
//     initialPageParam: 0,
//     queryFn: ({ pageParam }) =>
//       api
//         .get<InfinitePage<T>>(url, { params: { ...params, page: pageParam } })
//         .then((r) => r.data),
//     getNextPageParam: (last) => last.nextPage,
//   });
// }

export function useApiInfinite<T>(
  key: QueryKey,
  url: string,
  params: { size: number; sort?: string }
) {
  return useInfiniteQuery<InfinitePage<T>, Error>({
    queryKey: key,
    initialPageParam: 0,

    queryFn: async ({ pageParam }) => {
      const requestParams = { ...params, page: pageParam };
      const { data } = await api.get<InfinitePage<T>>(url, {
        params: requestParams,
      });

      return data;
    },

    getNextPageParam: last => last.nextPage,
  });
}
