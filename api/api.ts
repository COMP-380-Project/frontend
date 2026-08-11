export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const apiFetch = async (
    url: string,
    options?: RequestInit
): Promise<Response> => {
    const auth = localStorage.getItem("auth");
    const token = auth ? JSON.parse(auth).token : null;

    const defaultHeaders = {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options?.headers,
    };

    const headers = token
        ? {
              ...defaultHeaders,
              Authorization: `Bearer ${token}`,
          }
        : defaultHeaders;

    return window.fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });
};
