// 1. Get the base URL from Vite Environment Variables
const ENV_URL = import.meta.env.VITE_API_URL;

// 2. Validate it exists (Professional check)
if (!ENV_URL) {
  console.error("❌ FATAL: VITE_API_URL is missing in .env file");
}

// 3. Construct the full API endpoint (appending /api/v1)
const BASE_URL = `${ENV_URL}/api/v1`;

console.log(`🔌 API Initialized at: ${BASE_URL}`);

// 4. Generic Request Handler
const request = async (method: string, endpoint: string, body?: any) => {
  const url = `${BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    // 'Authorization': `Bearer ${token}` // Future-proof for Auth
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({})); // Handle empty JSON safely

    if (!response.ok) {
      // Throw a readable error that UI can catch
      throw new Error(
        data.message || `Request failed with status ${response.status}`
      );
    }

    return data;
  } catch (error: any) {
    console.error(`❌ API Error [${method} ${endpoint}]:`, error.message);
    throw error;
  }
};

// 5. Export clean methods
export const api = {
  get: (endpoint: string) => request("GET", endpoint),
  post: (endpoint: string, data: any) => request("POST", endpoint, data),
  patch: (endpoint: string, data: any) => request("PATCH", endpoint, data),
  delete: (endpoint: string) => request("DELETE", endpoint),
};

// 6. Fetcher for React Query
export const fetcher = async (url: string) => {
  const res = await api.get(url);
  return res.data; // Assuming backend returns { status: 'success', data: ... }
};
