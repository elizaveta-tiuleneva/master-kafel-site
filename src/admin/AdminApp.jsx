import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { isSupabaseConfigured } from "../lib/supabase.js";
import AuthProvider from "./AuthProvider.jsx";
import { useAuth } from "./authContext.js";
import AdminLayout from "./AdminLayout.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProjectsPage from "./pages/ProjectsPage.jsx";
import ProjectEditPage from "./pages/ProjectEditPage.jsx";
import LeadsPage from "./pages/LeadsPage.jsx";
import LeadPage from "./pages/LeadPage.jsx";

function FullScreenMessage({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-page px-4 text-center text-[16px] text-navy">
      <div>{children}</div>
    </div>
  );
}

function RequireAdmin({ children }) {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading" || status === "checking") {
    return <FullScreenMessage>Загрузка…</FullScreenMessage>;
  }
  if (status !== "admin") {
    return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}

// Загружается лениво из App.jsx: посетители сайта этот код не скачивают.
export default function AdminApp() {
  if (!isSupabaseConfigured) {
    return (
      <FullScreenMessage>
        <p className="font-bold">Админ-панель не настроена</p>
        <p className="mt-2 text-muted">
          Не заданы VITE_SUPABASE_URL и VITE_SUPABASE_PUBLISHABLE_KEY (см. docs/supabase-setup.md).
        </p>
      </FullScreenMessage>
    );
  }

  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<LoginPage />} />
        <Route
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<ProjectsPage />} />
          <Route path="projects/new" element={<ProjectEditPage />} />
          <Route path="projects/:id" element={<ProjectEditPage />} />
          <Route path="leads" element={<LeadsPage />} />
          <Route path="leads/:id" element={<LeadPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
