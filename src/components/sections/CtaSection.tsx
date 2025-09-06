import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const CtaSection = () => {
  return (
    <section className="py-32 bg-brand-gray relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/10 via-transparent to-brand-purple/10"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="container mx-auto px-8 lg:px-12 relative z-10 max-w-4xl">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Gratuito para sempre
          </div>
          
          <h2 className="text-5xl lg:text-7xl font-bold text-white mb-8 leading-tight">
            Deixe seus projetos{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              brilharem
            </span>
          </h2>
          
          <p className="text-xl lg:text-2xl text-white/80 mb-12 leading-relaxed">
            Snap é o toque final que faltava. Transforme capturas simples em apresentações que impressionam.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-xl px-12 py-6 h-16 bg-white text-brand-gray hover:bg-white/90 hover:text-brand-gray shadow-2xl"
            >
              Experimente Gratuitamente
              <ArrowRight className="w-6 h-6" />
            </Button>
            
            <div className="text-white/60 text-sm">
              Sem cadastro • Sem cartão de crédito • Sem limites
            </div>
          </div>
          
          {/* Features list */}
          <div className="flex flex-wrap justify-center gap-8 text-white/70">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Open Source</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>API Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Múltiplos Formatos</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              <span>Qualidade 4K</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;