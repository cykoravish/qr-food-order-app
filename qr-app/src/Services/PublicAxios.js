import axios from "axios";

const publicAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKENDURLL}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false
});

export default publicAxios;
