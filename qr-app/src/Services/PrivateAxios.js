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
        console.log("axios interceptor from local storage")
        const token = localStorage.getItem('token'); // or get from context/store
        console.log("axios interceptor from local storage token : ", token)
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

PrivateAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Handle token expiry or redirect to login
            console.warn('Unauthorized, redirecting to login...');
            // window.location.href = '/login'; // if needed
        }
        return Promise.reject(error);
    }
);
export default PrivateAxios;
