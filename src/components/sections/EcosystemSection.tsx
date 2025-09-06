import { Link, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const EcosystemSection = () => {
  return (
    <section className="py-24 bg-gradient-hero relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-brand-blue/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-8 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-brand-gray mb-6">
              Ecossistema{" "}
              <span className="bg-gradient-primary bg-clip-text text-transparent">Momentum</span>
            </h2>
            <p className="text-xl text-brand-light-gray">
              Snap faz parte de um ecossistema completo de ferramentas para criadores
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Snap */}
            <div className="group p-8 rounded-3xl bg-white border-2 border-brand-blue shadow-card hover:shadow-brand transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:animate-pulse-glow">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-gray mb-3">Snap</h3>
              <p className="text-brand-light-gray mb-4">
                Transforme capturas de tela em thumbnails profissionais
              </p>
              <div className="text-sm text-brand-blue font-medium">Você está aqui!</div>
            </div>
            
            {/* Snip */}
            <div className="group p-8 rounded-3xl bg-gradient-card border border-border shadow-card hover:shadow-soft transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                <Link className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-gray mb-3">Snip</h3>
              <p className="text-brand-light-gray mb-4">
                Encurtador de links inteligente com analytics avançados
              </p>
              <div className="text-sm text-emerald-600 font-medium">Em breve</div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-8 shadow-card">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="text-left">
                <h3 className="text-xl font-bold text-brand-gray mb-2">
                  Integração Perfeita
                </h3>
                <p className="text-brand-light-gray">
                  Links encurtados do Snip geram automaticamente thumbnails elegantes com o Snap
                </p>
              </div>
              
              <Button variant="outline_hero" className="flex-shrink-0">
                Saiba Mais
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EcosystemSection;