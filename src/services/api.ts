import axios from 'axios';

// On pointe directement vers ton Back-End Node.js
const BASE_URL = 'http://localhost:5000/api'; 

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// L'intercepteur qui glisse le token discrètement dans chaque requête
api.interceptors.request.use(
    (config) => {
        // MODIFICATION 1 : On utilise localStorage, qui est immédiat (plus besoin de "await")
        // MODIFICATION 2 : On cherche la clé 'token', car c'est sous ce nom qu'on l'a sauvegardé dans Zustand
        const token = localStorage.getItem('token'); 
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;