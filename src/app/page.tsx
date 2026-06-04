import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MadeWithDyad } from "@/components/made-with-dyad";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[80vh]">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
              Bem-vindo ao App Web
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Uma aplicação moderna e elegante construída com Next.js
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Começar
              </Button>
              <Button size="lg" variant="outline">
                Saiba Mais
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
            <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">Rápido</Badge>
                </CardTitle>
                <CardDescription>
                  Desempenho otimizado com Next.js e Tailwind CSS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Carregamento rápido e experiência fluida para os usuários.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">Moderno</Badge>
                </CardTitle>
                <CardDescription>
                  Design responsivo e interface intuitiva
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Interface adaptável para todos os dispositivos e tamanhos de tela.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">Seguro</Badge>
                </CardTitle>
                <CardDescription>
                  Práticas modernas de segurança e boas práticas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Segurança integrada desde o desenvolvimento da aplicação.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <MadeWithDyad />
    </div>
  );
}