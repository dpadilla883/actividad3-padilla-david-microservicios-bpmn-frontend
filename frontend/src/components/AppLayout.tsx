// src/components/AppLayout.tsx
import type { ReactNode } from "react";

import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";

export default function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  const items = [
    { label: "Autores", icon: "pi pi-users", command: () => navigate("/") },
    { label: "Publicaciones", icon: "pi pi-file", command: () => navigate("/publications") },
  ];

  return (
  <div className="min-h-screen surface-ground">
    <Menubar model={items} className="border-noround border-x-none" />

    <div className="p-3 md:p-5">
      <div className="mx-auto" style={{ maxWidth: 1100 }}>
        <div className="surface-card border-round-xl shadow-2 p-3 md:p-4">
          {children}
        </div>
      </div>
    </div>
  </div>
);

}
