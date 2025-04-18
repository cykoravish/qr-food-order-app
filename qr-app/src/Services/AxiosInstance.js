import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    timeout: 10000,
});
export default axiosInstance;


export const axiosAuth = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
    timeout: 10000,
});

