// app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Loader2 } from "lucide-react";
import Sidebar from "../components/Sidebar";
import InventoryTable from "../components/InventoryTable";

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión y rol al montar
  useEffect(() => {
    const init = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }
      setSession(session);
      if (session?.user) {
        const { data, error: roleError } = await supabase
          .from("user_roles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (!roleError) setRole(data.role);
      }
      setLoading(false);
    };
    init();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!session) {
    if (typeof window !== "undefined") window.location.href = "/login";
    return null;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar email={session.user.email!} role={role!} />
      <main className="flex-1 p-6">
        <h1 className="mb-4 text-2xl font-semibold">Inventario de Sistemas</h1>
        <InventoryTable userRole={role!} />
      </main>
    </div>
  );
}
