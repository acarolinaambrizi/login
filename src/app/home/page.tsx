"use client";

import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
    toast.success("Logout realizado com sucesso!");
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Meu To Do
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Bem-vindo, {user?.user_metadata?.full_name || user?.email}
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
          
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle>Dashboard</CardTitle>
              <CardDescription>
                Suas tarefas e atividades
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-gray-300">
                Conteúdo protegido - apenas usuários autenticados
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}