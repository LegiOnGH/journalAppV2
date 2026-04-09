import axios from "axios";

const API = axios.create({
    baseURL : "http://localhost:8080",
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if(token){
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
},
(error) => Promise.reject(error)
);

API.interceptors.response.use((response) =>
    response,
(error) => {
    const status = error.response?.status;
    if(status === 401){
        localStorage.clear();
        if (window.location.pathname !== "/") {
            window.location.href = "/";
        }
    }
    return Promise.reject(error);
}
);

export default API;