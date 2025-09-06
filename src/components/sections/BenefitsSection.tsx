import { Palette, Smartphone, Zap, Link } from "lucide-react";

const benefits = [
  {
    icon: Palette,
    title: "Estilo Automático",
    description: "Gradientes, bordas, sombras e mockups aplicados automaticamente para um visual profissional."
  },
  {
    icon: Smartphone,
    title: "Responsivo",
    description: "Previews otimizados para desktop, tablet e mobile com qualidade perfeita em todos os dispositivos."
  },
  {
    icon: Zap,
    title: "Rápido e Simples",
    description: "De URL para thumbnail estilizada em segundos. Interface intuitiva e sem complicação."
  },
  {
    icon: Link,
    title: "Integração Fácil",
    description: "Perfeito para GitHub, LinkedIn, Behance e apresentações. Exporte em múltiplos formatos."
  }
];

const BenefitsSection = () => {
  return (
    <section id="recursos" className="py-24 bg-background">
      <div className="container mx-auto px-8 lg:px-12 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-gray mb-6">
            Por que escolher o{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">Snap?</span>
          </h2>
          <p className="text-xl text-brand-light-gray max-w-3xl mx-auto">
            Criado para desenvolvedores, designers e criadores que valorizam apresentações impecáveis
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group relative p-8 rounded-2xl bg-gradient-card border border-border shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-2"
            >
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 group-hover:animate-pulse-glow transition-all duration-300">
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-brand-gray mb-3">
                  {benefit.title}
                </h3>
                <p className="text-brand-light-gray leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;