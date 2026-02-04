// src/App.tsx
import { Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import AuthorsPage from "./pages/AuthorsPage";
import PublicationsPage from "./pages/PublicationsPage";

export default function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<AuthorsPage />} />
        <Route path="/publications" element={<PublicationsPage />} />
      </Routes>
    </AppLayout>
  );
}
