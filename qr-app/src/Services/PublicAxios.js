import axios from "axios";

const publicAxios = axios.create({
    baseURL: "http://localhost:5000/api/v1", // replace with your backend URL
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false
});

export default publicAxios;