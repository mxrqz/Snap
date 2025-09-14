import Image from "next/image";
import { Compare } from "../ui/compare";

const ExamplesSection = () => {
  return (
    <section id="exemplos" className="py-24 bg-gradient-hero">
      <div className="container mx-auto px-8 lg:px-12 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-brand-gray mb-6">
            Veja a{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">transformação</span>
          </h2>
          <p className="text-xl text-brand-light-gray max-w-2xl mx-auto">
            De capturas simples para apresentações profissionais em um clique
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="relative bg-white rounded-3xl aspect-video shadow-brand">
            <Compare
              className="w-full relative h-full z-0"
              firstImage="./before.png"
              secondImage="./after.png"
              firstImageClassName="object-cover object-center"
              secondImageClassname="object-cover object-center"
            />

            {/* Labels */}
            <div className="absolute top-12 left-12">
              <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-sm font-medium">
                Antes
              </div>
            </div>
            
            <div className="absolute top-12 right-12">
              <div className="bg-gradient-primary text-white px-4 py-2 rounded-full text-sm font-medium">
                Depois
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 text-center">
            <div>
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                10x
              </div>
              <div className="text-brand-light-gray">
                Mais atrativo
              </div>
            </div>

            <div>
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                &lt; 5s
              </div>
              <div className="text-brand-light-gray">
                Para processar
              </div>
            </div>

            <div>
              <div className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
                100%
              </div>
              <div className="text-brand-light-gray">
                Automático
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExamplesSection;