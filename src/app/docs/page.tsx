"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Copy, ExternalLink, ArrowLeft, Play } from "lucide-react";
import Link from "next/link";

const DocsPage = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ children, language = "javascript", id }: { children: string; language?: string; id: string }) => (
    <div className="relative">
      <pre className="bg-brand-gray text-white p-6 rounded-xl text-sm overflow-x-auto">
        <code>{children}</code>
      </pre>
      <Button
        size="sm"
        variant="ghost"
        className="absolute top-4 right-4 text-white/60 hover:text-white hover:bg-white/10"
        onClick={() => copyToClipboard(children, id)}
      >
        {copiedCode === id ? "Copiado!" : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-8 lg:px-12 py-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-brand-gray">Documentação da API</h1>
                <p className="text-brand-light-gray">Como usar a Snap API para criar screenshots profissionais</p>
              </div>
            </div>
            <Badge variant="outline" className="gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              v1.0.0
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-8 lg:px-12 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6">
              <div>
                <h3 className="font-semibold text-brand-gray mb-3">Início Rápido</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#introducao" className="text-brand-light-gray hover:text-brand-blue">Introdução</a></li>
                  <li><a href="#autenticacao" className="text-brand-light-gray hover:text-brand-blue">Autenticação</a></li>
                  <li><a href="#exemplos" className="text-brand-light-gray hover:text-brand-blue">Exemplos Básicos</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-brand-gray mb-3">Endpoints</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#post-snap" className="text-brand-light-gray hover:text-brand-blue">POST /api/snap</a></li>
                  <li><a href="#get-snap" className="text-brand-light-gray hover:text-brand-blue">GET /api/snap</a></li>
                  <li><a href="#preview" className="text-brand-light-gray hover:text-brand-blue">GET /api/preview</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-brand-gray mb-3">Referência</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#parametros" className="text-brand-light-gray hover:text-brand-blue">Parâmetros</a></li>
                  <li><a href="#estilos" className="text-brand-light-gray hover:text-brand-blue">Configurações de Estilo</a></li>
                  <li><a href="#responses" className="text-brand-light-gray hover:text-brand-blue">Responses</a></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Introdução */}
            <section id="introducao">
              <h2 className="text-2xl font-bold text-brand-gray mb-6">Introdução</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-brand-light-gray leading-relaxed mb-6">
                  A Snap API permite criar screenshots profissionais e estilizados de websites em segundos. 
                  Adicione bordas arredondadas, gradientes, mockups de navegador, sombras e muito mais - 
                  tudo através de uma API simples e poderosa.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <Card className="border-border">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4 mx-auto">
                        <Code className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-brand-gray mb-2">Fácil de usar</h3>
                      <p className="text-sm text-brand-light-gray">Apenas uma URL para começar</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-border">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                        <Play className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-brand-gray mb-2">Rápido</h3>
                      <p className="text-sm text-brand-light-gray">Screenshots em menos de 5s</p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-border">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                        <ExternalLink className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-brand-gray mb-2">Gratuito</h3>
                      <p className="text-sm text-brand-light-gray">Sem limites ou cadastro</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </section>

            {/* Exemplos Básicos */}
            <section id="exemplos">
              <h2 className="text-2xl font-bold text-brand-gray mb-6">Exemplos Básicos</h2>
              
              <Tabs defaultValue="simple" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="simple">Simples</TabsTrigger>
                  <TabsTrigger value="styled">Com Estilo</TabsTrigger>
                  <TabsTrigger value="advanced">Avançado</TabsTrigger>
                </TabsList>
                
                <TabsContent value="simple" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant="success">POST</Badge>
                        Screenshot Simples
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <CodeBlock id="simple-example">
{`// JavaScript
const response = await fetch('/api/snap', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://github.com'
  })
});

const data = await response.json();
console.log(data.imageUrl); // Base64 image data`}
                      </CodeBlock>
                      
                      <CodeBlock id="simple-curl">
{`# cURL
curl -X POST http://localhost:3001/api/snap \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://github.com"}'`}
                      </CodeBlock>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="styled" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant="success">POST</Badge>
                        Screenshot com Gradiente
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock id="styled-example">
{`const response = await fetch('/api/snap', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://tailwindcss.com',
    style: {
      borderRadius: 15,
      margin: 40,
      background: {
        type: 'gradient',
        direction: 'to-br',
        colors: [
          { color: '#667eea', position: 0 },
          { color: '#764ba2', position: 100 }
        ]
      },
      browserMockup: 'safari',
      shadow: {
        enabled: true,
        blur: 20,
        offsetY: 10
      }
    }
  })
});`}
                      </CodeBlock>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Badge variant="success">POST</Badge>
                        Configuração Avançada
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock id="advanced-example">
{`const response = await fetch('/api/snap', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    url: 'https://react.dev',
    screenshot: {
      viewport: {
        width: 1280,
        height: 720,
        isMobile: false
      },
      colorScheme: 'dark',
      delay: 3000
    },
    style: {
      borderRadius: 12,
      margin: 60,
      background: {
        type: 'gradient',
        direction: 'to-r',
        colors: [
          { color: '#FF6B6B', position: 0 },
          { color: '#4ECDC4', position: 50 },
          { color: '#45B7D1', position: 100 }
        ]
      },
      browserMockup: 'chrome',
      finalSize: {
        width: 1200,
        aspectRatio: '16:9',
        maintainAspectRatio: true
      }
    }
  })
});`}
                      </CodeBlock>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </section>

            {/* Endpoints */}
            <section id="post-snap">
              <h2 className="text-2xl font-bold text-brand-gray mb-6">Endpoints da API</h2>
              
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="success">POST</Badge>
                    <code>/api/snap</code>
                  </CardTitle>
                  <p className="text-brand-light-gray">Gera screenshot estilizado usando configuração JSON (recomendado)</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-brand-gray mb-3">Request Body</h4>
                    <CodeBlock id="post-body-schema">
{`{
  "url": "https://example.com",     // Obrigatório
  "screenshot": {                   // Opcional
    "viewport": {
      "width": 1920,               // 320-4096
      "height": 1080,              // 240-4096
      "isMobile": false
    },
    "colorScheme": "dark",          // "light" | "dark"
    "delay": 2000                   // 0-10000ms
  },
  "style": {                       // Opcional
    "borderRadius": 15,            // 0-50px
    "margin": 40,                  // 0-200px
    "browserMockup": "safari",     // "safari" | "chrome" | "firefox" | "edge" | "none"
    "background": {
      "type": "gradient",          // "solid" | "gradient"
      "direction": "to-br",        // Direção do gradiente
      "colors": [
        { "color": "#667eea", "position": 0 },
        { "color": "#764ba2", "position": 100 }
      ]
    },
    "shadow": {
      "enabled": true,
      "blur": 20,                  // 0-50px
      "offsetY": 10                // -50 a 50px
    }
  }
}`}
                    </CodeBlock>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-brand-gray mb-3">Response</h4>
                    <CodeBlock id="post-response">
{`{
  "success": true,
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA...",
  "metadata": {
    "originalUrl": "https://example.com",
    "processedAt": "2023-12-07T10:30:00.000Z",
    "dimensions": {
      "width": 1984,
      "height": 1144
    }
  }
}`}
                    </CodeBlock>
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8" id="get-snap">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">GET</Badge>
                    <code>/api/snap</code>
                  </CardTitle>
                  <p className="text-brand-light-gray">Gera screenshot usando query parameters (para integração simples)</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-brand-gray mb-3">Exemplo</h4>
                    <CodeBlock id="get-example">
{`// URL completa
http://localhost:3001/api/snap?url=https://github.com&borderRadius=15&margin=40&background.type=gradient&background.direction=to-br&browserMockup=safari&shadow.enabled=true

// JavaScript
const imageUrl = '/api/snap?' + new URLSearchParams({
  url: 'https://github.com',
  borderRadius: '15',
  margin: '40',
  'background.type': 'gradient',
  'background.direction': 'to-br',
  browserMockup: 'safari',
  'shadow.enabled': 'true'
});`}
                    </CodeBlock>
                  </div>
                </CardContent>
              </Card>

              <Card id="preview">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Badge variant="outline">GET</Badge>
                    <code>/api/preview</code>
                  </CardTitle>
                  <p className="text-brand-light-gray">Visualiza o screenshot em uma página HTML com opções de download</p>
                </CardHeader>
                <CardContent>
                  <CodeBlock id="preview-example">
{`// Abrir no navegador
http://localhost:3001/api/preview?url=https://github.com&borderRadius=15&margin=40

// HTML response com preview interativo
<!DOCTYPE html>
<html>
  <body>
    <img src="data:image/png;base64,..." />
    <button onclick="download()">Download PNG</button>
  </body>
</html>`}
                  </CodeBlock>
                </CardContent>
              </Card>
            </section>

            {/* Parâmetros */}
            <section id="parametros">
              <h2 className="text-2xl font-bold text-brand-gray mb-6">Referência de Parâmetros</h2>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Screenshot</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 font-semibold text-brand-gray">Parâmetro</th>
                            <th className="text-left py-3 font-semibold text-brand-gray">Tipo</th>
                            <th className="text-left py-3 font-semibold text-brand-gray">Default</th>
                            <th className="text-left py-3 font-semibold text-brand-gray">Descrição</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          <tr className="border-b border-border/50">
                            <td className="py-3 font-mono text-brand-blue">viewport.width</td>
                            <td className="py-3 text-brand-light-gray">integer</td>
                            <td className="py-3 text-brand-light-gray">1920</td>
                            <td className="py-3 text-brand-light-gray">Largura do viewport (320-4096px)</td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 font-mono text-brand-blue">viewport.height</td>
                            <td className="py-3 text-brand-light-gray">integer</td>
                            <td className="py-3 text-brand-light-gray">1080</td>
                            <td className="py-3 text-brand-light-gray">Altura do viewport (240-4096px)</td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 font-mono text-brand-blue">colorScheme</td>
                            <td className="py-3 text-brand-light-gray">string</td>
                            <td className="py-3 text-brand-light-gray">dark</td>
                            <td className="py-3 text-brand-light-gray">"light" | "dark"</td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 font-mono text-brand-blue">delay</td>
                            <td className="py-3 text-brand-light-gray">integer</td>
                            <td className="py-3 text-brand-light-gray">2000</td>
                            <td className="py-3 text-brand-light-gray">Delay adicional em ms (0-10000)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configurações de Estilo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 font-semibold text-brand-gray">Parâmetro</th>
                            <th className="text-left py-3 font-semibold text-brand-gray">Tipo</th>
                            <th className="text-left py-3 font-semibold text-brand-gray">Default</th>
                            <th className="text-left py-3 font-semibold text-brand-gray">Descrição</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          <tr className="border-b border-border/50">
                            <td className="py-3 font-mono text-brand-blue">borderRadius</td>
                            <td className="py-3 text-brand-light-gray">integer</td>
                            <td className="py-3 text-brand-light-gray">8</td>
                            <td className="py-3 text-brand-light-gray">Bordas arredondadas (0-50px)</td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 font-mono text-brand-blue">margin</td>
                            <td className="py-3 text-brand-light-gray">integer</td>
                            <td className="py-3 text-brand-light-gray">32</td>
                            <td className="py-3 text-brand-light-gray">Margem externa (0-200px)</td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 font-mono text-brand-blue">browserMockup</td>
                            <td className="py-3 text-brand-light-gray">string</td>
                            <td className="py-3 text-brand-light-gray">none</td>
                            <td className="py-3 text-brand-light-gray">"safari" | "chrome" | "firefox" | "edge" | "none"</td>
                          </tr>
                          <tr className="border-b border-border/50">
                            <td className="py-3 font-mono text-brand-blue">shadow.enabled</td>
                            <td className="py-3 text-brand-light-gray">boolean</td>
                            <td className="py-3 text-brand-light-gray">true</td>
                            <td className="py-3 text-brand-light-gray">Ativar sombra</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Status Codes */}
            <section id="responses">
              <h2 className="text-2xl font-bold text-brand-gray mb-6">Status Codes</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="success">200</Badge>
                      <h3 className="font-semibold text-green-800">Sucesso</h3>
                    </div>
                    <p className="text-sm text-green-700">Screenshot gerado com sucesso</p>
                  </CardContent>
                </Card>
                
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="destructive">400</Badge>
                      <h3 className="font-semibold text-red-800">Bad Request</h3>
                    </div>
                    <p className="text-sm text-red-700">Parâmetros inválidos ou URL malformada</p>
                  </CardContent>
                </Card>
                
                <Card className="border-orange-200 bg-orange-50">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800">503</Badge>
                      <h3 className="font-semibold text-orange-800">Service Unavailable</h3>
                    </div>
                    <p className="text-sm text-orange-700">Serviço temporariamente indisponível</p>
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;