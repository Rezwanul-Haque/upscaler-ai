export type ApiError = {
  detail: string;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
};
