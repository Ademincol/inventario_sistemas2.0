// app/components/Sidebar.tsx
"use client";

import { supabase } from "../lib/supabase";
import { LogOut, User } from "lucide-react";

interface SidebarProps {
  email: string;
  role: string;
}

export default function Sidebar({ email, role }: SidebarProps) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  return (
    <aside className="w-64 bg-white shadow-md p-4 flex flex-col justify-between h-screen">
      <div>
        <h2 className="mb-6 flex items-center text-xl font-bold">
          <User className="mr-2 h-5 w-5" /> Inventario
        </h2>
        <p className="mb-1 text-sm font-medium text-gray-700">Correo:</p>
        <p className="mb-3 truncate text-gray-600">{email}</p>
        <p className="mb-1 text-sm font-medium text-gray-700">Rol:</p>
        <p className="text-gray-600 capitalize">{role}</p>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center rounded-md bg-red-500 px-3 py-2 text-white hover:bg-red-600"
      >
        <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
      </button>
    </aside>
  );
}

