const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T = any> {
    success?: boolean;
    data?: T;
    error?: string;
}

export const apiFetch = async <T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> => {
    const token =
        typeof window !== 'undefined'
            ? localStorage.getItem('accessToken')
            : null;

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers,
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
