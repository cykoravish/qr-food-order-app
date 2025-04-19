import axios from "axios";

const PrivateAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

PrivateAxios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Don't manually set Content-Type if it's FormData
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default PrivateAxios;
