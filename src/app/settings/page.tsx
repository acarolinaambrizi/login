import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MadeWithDyad } from "@/components/made-with-dyad";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configurações
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie suas preferências e configurações do sistema
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle>Perfil do Usuário</CardTitle>
              <CardDescription>
                Informações pessoais e de conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-600">JD</span>
                </div>
                <div>
                  <p className="font-medium">João da Silva</p>
                  <p className="text-sm text-muted-foreground">joao.silva@example.com</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Editar Perfil
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle>Preferências</CardTitle>
              <CardDescription>
                Personalize sua experiência
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Modo Escuro</p>
                  <p className="text-sm text-muted-foreground">Ativar tema escuro</p>
                </div>
                <Badge variant="secondary">Ativado</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações</p>
                  <p className="text-sm text-muted-foreground">Receber notificações</p>
                </div>
                <Badge variant="secondary">Ativado</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Idioma</p>
                  <p className="text-sm text-muted-foreground">Português (Brasil)</p>
                </div>
                <Badge variant="secondary">PT-BR</Badge>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Proteja sua conta e dados
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Senha</p>
                  <p className="text-sm text-muted-foreground">Última alteração: 30 dias atrás</p>
                </div>
                <Button variant="outline" size="sm">
                  Alterar
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Autenticação de Dois Fatores</p>
                  <p className="text-sm text-muted-foreground">Adicionar camada extra de segurança</p>
                </div>
                <Button variant="outline" size="sm">
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle>Sobre</CardTitle>
              <CardDescription>
                Informações do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Versão</p>
                  <p className="text-sm text-muted-foreground">1.0.0</p>
                </div>
                <Badge variant="secondary">v1.0.0</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Última Atualização</p>
                  <p className="text-sm text-muted-foreground">15 de dezembro de 2024</p>
                </div>
                <Badge variant="secondary">Atualizado</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
}