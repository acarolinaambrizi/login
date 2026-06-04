"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Verifica se o usuário já está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Se já estiver logado, redireciona para a home
        router.push("/home");
      } else {
        // Se não estiver logado, redireciona para o login
        router.push("/login");
      }
    });
  }, [router]);

  // Mostra um carregamento enquanto verifica o estado de autenticação
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-300">Carregando...</p>
      </div>
    </div>
  );
}