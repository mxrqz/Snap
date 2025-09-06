import { Code, Palette, Briefcase, GraduationCap } from "lucide-react";

const useCases = [
  {
    icon: Code,
    title: "Desenvolvedores",
    description: "README no GitHub",
    details: "Torne seus repositórios mais atraentes com screenshots profissionais dos seus projetos.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Palette,
    title: "Designers",
    description: "Portfolio no Behance/Dribbble",
    details: "Apresente seus projetos web com capturas elegantes que destacam seu trabalho.",
    color: "from-purple-500 to-pink-500"
  },
  {
    icon: Briefcase,
    title: "Freelancers/Agências",
    description: "Apresentações e redes sociais",
    details: "Impressione clientes com materiais visuais profissionais para propostas e marketing.",
    color: "from-green-500 to-emerald-500"
  },
  {
    icon: GraduationCap,
    title: "Empresas/Estudantes",
    description: "Documentação e projetos acadêmicos",
    details: "Eleve o padrão visual de relatórios, TCC e documentações técnicas.",
    color: "from-orange-500 to-red-500"
  }
];

const UseCasesSection = () => {
  return (
    <section id="casos-uso" className="py-24 bg-background">
      <div className="container mx-auto px-8 lg:px-12 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-gray mb-6">
            Casos de{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">uso</span>
          </h2>
          <p className="text-xl text-brand-light-gray max-w-2xl mx-auto">
            Snap atende profissionais de todas as áreas que precisam de apresentações visuais impecáveis
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {useCases.map((useCase, index) => (
            <div 
              key={index}
              className="group relative overflow-hidden rounded-3xl bg-gradient-card border border-border shadow-card hover:shadow-soft transition-all duration-500 hover:-translate-y-1"
            >
              <div className="p-8">
                <div className="flex items-start gap-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${useCase.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                    <useCase.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-brand-gray mb-2">
                      {useCase.title}
                    </h3>
                    <div className="text-brand-blue font-medium mb-3">
                      {useCase.description}
                    </div>
                    <p className="text-brand-light-gray leading-relaxed">
                      {useCase.details}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Hover Effect */}
              <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCasesSection;