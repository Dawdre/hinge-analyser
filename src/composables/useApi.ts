import {
  createFetch, type UseFetchOptions
} from "@vueuse/core"

const BASE_URL = "http://localhost:8000"

const defaultFetchOptions: UseFetchOptions = {
  immediate: true,
}

export function useApi<T = void>(url: string, { immediate }: UseFetchOptions = defaultFetchOptions) {
  const useMyFetch = createFetch({
    baseUrl: `${BASE_URL}`,
    options: {
      immediate,
      async beforeFetch({ options }) {     
        const token = localStorage.getItem("token");
        
        if (token) {
          options.headers.Authorization = `Bearer ${token}`;
        }
        
        return { options }
      },
    },
    fetchOptions: { mode: "cors" },
  });

  return useMyFetch<T>(url).json();
}