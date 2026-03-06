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

        // Critical: Handle 401 Unauthorized globally to stop redirect loops
        if (response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                // We don't force a redirect here to allow components to handle it gracefully,
                // but removing 'user' stops the LoginPage from looping back.
            }
            const data = await response.json().catch(() => ({ error: 'Unauthorized' }));
            return { success: false, error: data.error || 'Authentication required' };
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP ${response.status}`);
        }

        return { success: true, data };
    } catch (error: any) {
        return { success: false, error: error.message || 'Network error' };
    }
};
