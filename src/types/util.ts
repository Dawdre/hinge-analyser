import type { Person } from '@/types/api'

export interface Pagination {
  current_page: number;
  page_count: number;
}

export type PersonsWithPagination = Pagination & { persons: Array<Person> };