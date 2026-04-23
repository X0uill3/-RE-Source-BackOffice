import { create } from 'zustand';

// 1. L'interface avec nos fonctions web
interface AuthState {
    user: any | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    restoreToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,

    // 2. Le login adapté avec fetch et localStorage
    login: async (email, password) => {
        set({ isLoading: true });
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const result = await response.json();

            if (result.status === 'success') {
                // On sauvegarde dans le navigateur web
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.data.user));
                
                // On met à jour la mémoire Zustand
                set({ token: result.token, user: result.data.user, isLoading: false });
            } else {
                set({ isLoading: false });
                throw new Error(result.message || "Erreur de connexion");
            }
        } catch (error: any) {
            set({ isLoading: false });
            throw new Error(error.message || "Impossible de contacter le serveur");
        }
    },

    // 3. Le logout web
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ token: null, user: null, isLoading: false });
    },

    // 4. La restauration web (quand on actualise la page)
    restoreToken: () => {
        set({ isLoading: true });
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            set({ token, user: JSON.parse(storedUser), isLoading: false });
        } else {
            set({ token: null, user: null, isLoading: false });
        }
    }
}));