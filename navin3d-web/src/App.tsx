import { lazy } from "react";
import { createBrowserRouter, createMemoryRouter, RouterProvider, type RouteObject } from "react-router-dom";
import { isArtifact } from "./lib/runtime";
import { Layout } from "./components/layout/Layout";
import Home from "./pages/Home";

// Other pages load on demand so the first visit stays fast.
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const About = lazy(() => import("./pages/About"));
const Catalogue = lazy(() => import("./pages/Catalogue"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));

const routes: RouteObject[] = [
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/products", element: <Products /> },
      { path: "/products/:slug", element: <ProductDetail /> },
      { path: "/about", element: <About /> },
      { path: "/catalogue", element: <Catalogue /> },
      { path: "/contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
];

// The claude.ai preview has no per-page addresses, so it keeps navigation in memory.
const router = isArtifact
  ? createMemoryRouter(routes)
  : createBrowserRouter(routes, { basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/" });

export default function App() {
  return <RouterProvider router={router} />;
}
