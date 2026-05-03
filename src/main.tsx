import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
// @ts-ignore: side-effect CSS import requires module declaration
import "./styles/index.css";

// 1. AJOUTEZ CETTE LIGNE (L'importation de React Query)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 2. AJOUTEZ CETTE LIGNE (La création de la mémoire cache)
const queryClient = new QueryClient();

// 3. ENGLOBEZ VOTRE <App /> COMME CECI :
createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);