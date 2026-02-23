// In local dev and production, point to the Express server via environment variable.
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL as string).replace(/\/$/, "");

export interface ApiResponse<T = any> {
    success?: boolean;
    data?: T;
    error?: string;
}

export const apiFetch = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> => {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include',
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || 'Network error' };
    }
};
