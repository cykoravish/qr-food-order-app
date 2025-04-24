import axios from "axios";

const PrivateAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false
});
PrivateAxios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Auto logout or redirect if token is invalid/expired
            localStorage.removeItem('token');
            window.location.href = '/login'; // optional
        }
        return Promise.reject(error);
    }
);


export default PrivateAxios;
