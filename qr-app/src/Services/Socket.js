// import { io } from 'socket.io-client';

import { io } from "socket.io-client";
const backendURL = import.meta.env.VITE_BACKEND_URL;
// // "undefined" means the URL will be computed from the `window.location` object
// const URL = (import.meta.env.VITE_BACKEND_URL) === 'production' ? undefined : `${process.env.VITE_BACKEND_URL}`;

// export const socket = io(URL, {
//     autoConnect: false
// });

export const socket = io(backendURL);
