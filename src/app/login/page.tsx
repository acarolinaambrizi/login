"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { toast } from "sonner";

/**
 * Página de login.
 * Utiliza o componente Auth da biblioteca @supabase/auth-ui-react.
 * Redireciona o usuário autenticado para a página principal.
 */
export default function LoginPage() {
  const router = useRouter();

  const handleAuthChange = async (event: string, session: any) => {
    if (event === "SIGNED_IN") {
      toast.success("Login realizado com sucesso!");
      router.push("/home");
    } else if (event === "SIGNED_OUT") {
      toast.info("Você saiu da conta.");
    }
  };

  // Escuta mudanças de autenticação para redirecionar automaticamente
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_IN" && session?.user) {
      router.replace("/home");
    }
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">
          Entrar
        </h2>
        <Auth
          supabaseClient={supabase}
          providers={[]}
          appearance={{
            theme: ThemeSupa,
          }}
          theme="light"
          onSignIn={() => toast.success("Login bem‑sucedido!")}
          onSignOut={() => toast.info("Logout efetuado.")}
        />
      </div>
    </div>
  );
}