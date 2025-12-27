// dea-local-frontend/src/api/api.js

const BASE_URL = import.meta.env.VITE_LOCAL_SERVER_URL;

/*
  Generic API request wrapper
  - auto sends cookies
  - auto refreshes token on 401
*/
async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {})
      },
      ...options
    });

    // If access token expired, try refresh once
    if (res.status === 401) {
      const refreshed = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include"
      });

      if (!refreshed.ok) {
        throw new Error("Session expired");
      }

      // retry original request
      const retry = await fetch(`${BASE_URL}${path}`, {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },
        ...options
      });

      if (!retry.ok) {
        throw new Error("Request failed after refresh");
      }

      return retry.json();
    }

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Request failed");
    }

    return res.json();
  } catch (err) {
    console.error("API ERROR:", err.message);
    throw err;
  }
}

/* ===============================
   AUTH APIs
================================ */
export const authAPI = {
  me: () => request("/auth/me"),
  login: (data) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data)
    }),
  logout: () =>
    request("/auth/logout", {
      method: "POST"
    })
};

/* ===============================
   BUNDLE APIs
================================ */
// export const bundleAPI = {
//   getBundles: () => request("/bundles"),
//   createBundle: (data) =>
//     request("/bundles", {
//       method: "POST",
//       body: JSON.stringify(data)
//     })
// };

/* ===============================
   WORKSPACE APIs (future)
================================ */
export const workspaceAPI = {
  getWorkspace: () => request("/workspace")
};


/* ===============================
   MEMBERS APIs
================================ */
export const memberAPI = {
  getMembers: () => request("/api/members")
};

/* ===============================
   BUNDLE APIs (FormData)
================================ */
export const bundleAPI = {
  getBundles: () => request("/bundles"),

  createBundle: (formData) =>
    fetch(`${BASE_URL}/bundles`, {
      method: "POST",
      credentials: "include",
      body: formData // ❗ DO NOT set Content-Type
    }).then(async (res) => {
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Bundle creation failed");
      }
      return res.json();
    })
};