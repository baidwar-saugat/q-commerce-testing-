const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const api = {
  get: async (endpoint: string) => {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`);
      const json = await res.json();
      return json.data;
    } catch (e) {
      console.error("Backend Error:", e);
      return null;
    }
  },

  post: async (endpoint: string, body: any) => {
    try {
      const res = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      // Our backend returns { serviceable: true/false, ... } for location check
      return json;
    } catch (e) {
      console.error("Backend Error:", e);
      return null;
    }
  },
};
