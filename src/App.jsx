import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ServicesPage from "./pages/ServicesPage.jsx";
import PortfolioPage from "./pages/PortfolioPage.jsx";
import ProjectDetailsPage from "./pages/ProjectDetailsPage.jsx";
import ConsultationPage from "./pages/ConsultationPage.jsx";

// Админ-панель — отдельный файл, который скачивается только при входе в /admin.
const AdminApp = lazy(() => import("./admin/AdminApp.jsx"));

export default function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <Suspense fallback={<div className="p-8 text-center text-navy">Загрузка…</div>}>
            <AdminApp />
          </Suspense>
        }
      />
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/:id" element={<ProjectDetailsPage />} />
        <Route path="/consultation" element={<ConsultationPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
