// Error response - always type: "error"
export type ApiError = {
  type: "error";
  title: string;
  detail: string;
  status: number;
  errors?: {
    field: string;
    issue: string;
  }[];
};

// Success response - always type: "success"
export type ApiSuccess<T> = {
  type: "success";
  data: T;
};

// Union type
export type ApiResponse<T> = ApiSuccess<T> | ApiError;
