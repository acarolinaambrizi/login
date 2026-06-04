import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MadeWithDyad } from "@/components/made-with-dyad";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Painel de controle principal
            </p>
          </div>
          <Button>
            Nova Tarefa
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Usuários
              </CardTitle>
              <Badge variant="secondary">+12%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +191 desde o último mês
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tarefas Concluídas
              </CardTitle>
              <Badge variant="secondary">+8%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">456</div>
              <p className="text-xs text-muted-foreground">
                +12 desde ontem
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Receita
              </CardTitle>
              <Badge variant="secondary">+20%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 12,345</div>
              <p className="text-xs text-muted-foreground">
                +R$ 1,234 desde o último mês
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Conversão
              </CardTitle>
              <Badge variant="secondary">+5%</Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.2%</div>
              <p className="text-xs text-muted-foreground">
                +0.5% desde ontem
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>
                Últimas atividades no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Novo usuário registrado</p>
                    <p className="text-xs text-muted-foreground">Há 2 minutos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tarefa concluída</p>
                    <p className="text-xs text-muted-foreground">Há 15 minutos</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Atualização disponível</p>
                    <p className="text-xs text-muted-foreground">Há 1 hora</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
            <CardHeader>
              <CardTitle>Próximos Eventos</CardTitle>
              <CardDescription>
                Eventos agendados para esta semana
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Reunião de equipe</p>
                    <p className="text-xs text-muted-foreground">Terça, 14:00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Entrega do projeto</p>
                    <p className="text-xs text-muted-foreground">Quinta, 17:00</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Webinar de treinamento</p>
                    <p className="text-xs text-muted-foreground">Sexta, 10:00</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
}