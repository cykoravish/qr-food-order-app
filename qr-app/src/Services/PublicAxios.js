import axios from "axios";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
console.log(backendUrl)
const publicAxios = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
    headers: {
        "Content-Type": "application/json",
    }
});

export default publicAxios;
