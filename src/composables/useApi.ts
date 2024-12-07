import {
  createFetch, type UseFetchOptions
} from "@vueuse/core"
import type { MaybeRef } from 'vue'

export const BASE_URL = "http://localhost:8000"

const defaultFetchOptions: UseFetchOptions = {
  immediate: true,
  refetch: false
}

export function useApi<T = void>(url: MaybeRef<string>, { immediate, refetch }: UseFetchOptions = defaultFetchOptions) {
  const useMyFetch = createFetch({
    baseUrl: `${BASE_URL}`,
    options: {
      immediate,
      refetch,
      async beforeFetch({ options }) {     
        const token = localStorage.getItem("token");
        
        if (token) {
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
          }
        }
        
        return { options }
      },
    },
    fetchOptions: { mode: "cors" },
  });

  return useMyFetch<T>(url).json();
}