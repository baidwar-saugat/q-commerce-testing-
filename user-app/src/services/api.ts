// const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// export const api = {
//   get: async (endpoint: string) => {
//     try {
//       const res = await fetch(`${BASE_URL}${endpoint}`);
//       const json = await res.json();
//       return json.data;
//     } catch (e) {
//       console.error("Backend Error:", e);
//       return null;
//     }
//   },

//   post: async (endpoint: string, body: any) => {
//     try {
//       const res = await fetch(`${BASE_URL}${endpoint}`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(body),
//       });
//       const json = await res.json();
//       // Our backend returns { serviceable: true/false, ... } for location check
//       return json;
//     } catch (e) {
//       console.error("Backend Error:", e);
//       return null;
//     }
//   },
// };
const BASE_URL = process.env.EXPO_PUBLIC_API_URL;

// Internal helper function to avoid code repetition
const request = async (method: string, endpoint: string, body?: any) => {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`[${method}] Requesting: ${url}`);

  const config: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const res = await fetch(url, config);
    const text = await res.text(); // Get raw text first to debug HTML errors

    try {
      const json = JSON.parse(text);
      // Backend returns { status: "success", data: ... }
      // We usually want to return 'json.data' or just 'json' depending on usage
      return json.data || json;
    } catch (err) {
      console.error(
        `[${method}] JSON Parse Error. Response:`,
        text.slice(0, 200)
      );
      return null;
    }
  } catch (e) {
    console.error(`[${method}] Network Error:`, e);
    throw e;
  }
};

export const api = {
  get: (endpoint: string) => request("GET", endpoint),
  post: (endpoint: string, body: any) => request("POST", endpoint, body),
  patch: (endpoint: string, body: any) => request("PATCH", endpoint, body), // <--- THIS WAS MISSING
  delete: (endpoint: string) => request("DELETE", endpoint),
};
