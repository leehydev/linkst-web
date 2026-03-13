const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "요청 실패" }));
    throw new Error(error.message || "요청 실패");
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// 링크 관련 API
export interface Link {
  id: string;
  slug: string;
  shortUrl: string;
  originUrl: string;
  title: string | null;
  isActive: boolean;
  clickCount: number;
  createdAt: string;
}

export interface PageResponse<T> {
  content: T[];
  totalCount: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface CreateLinkRequest {
  originUrl: string;
  title?: string;
}

export interface UpdateLinkRequest {
  title?: string;
  isActive?: boolean;
}

export const linkApi = {
  getMyLinks: (page = 0, size = 20) =>
    request<PageResponse<Link>>(`/links?page=${page}&size=${size}`),

  getLink: (id: string) =>
    request<Link>(`/links/${id}`),

  createLink: (data: CreateLinkRequest) =>
    request<Link>("/links", { method: "POST", body: data }),

  updateLink: (id: string, data: UpdateLinkRequest) =>
    request<Link>(`/links/${id}`, { method: "PUT", body: data }),

  deleteLink: (id: string) =>
    request<void>(`/links/${id}`, { method: "DELETE" }),
};
