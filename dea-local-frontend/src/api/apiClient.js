import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_LOCAL_SERVER_URL, // local server
    withCredentials: true, // for HttpOnly cookies (JWT)
    timeout: 15000,
});

/* Request Interceptor */
apiClient.interceptors.request.use(
    // (request) => { console.log(`API REQUEST${request}`) },
    (config) => {
        // add headers globally if needed
        // config.headers["Content-Type"] = "application/json";
        console.log(`[APIcleint] [REQUEST] \nURL: ${config.url}, \nMETHOD: ${config.method}, \nDATA: ${config.data}`)
        return config;
    },
    (error) => Promise.reject(error)
);

/* Response Interceptor */
apiClient.interceptors.response.use(
    (response) => {
        response.data
        console.log(`[APIcleint] [RESPONSE]`)
        console.log(response.url);
        return response;
    },
    (error) => {
        const message =
            error?.response?.data?.message ||
            error.message ||
            "Unknown API error";

        console.error("API ERROR:", message);
        return Promise.reject(message);
    }
);

export default apiClient;
