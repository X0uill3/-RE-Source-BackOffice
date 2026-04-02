import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ResourceDetail from "./pages/ResourceDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateResource from "./pages/CreateResource";
import AdminPanel from "./pages/AdminPanel";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "catalogue", Component: Catalog },
      { path: "ressource/:id", Component: ResourceDetail },
      { path: "connexion", Component: Login },
      { path: "inscription", Component: Register },
      { path: "tableau-de-bord", Component: Dashboard },
      { path: "creer-ressource", Component: CreateResource },
      { path: "admin", Component: AdminPanel },
      { path: "analytics", Component: Analytics },
      { path: "*", Component: NotFound },
    ],
  },
]);
