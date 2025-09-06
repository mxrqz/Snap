import Image from "next/image";

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
          <div className="relative bg-white rounded-3xl p-8 shadow-brand">
            <Image 
              src="/before-after.jpg"
              alt="Before and after examples of Snap transformations" 
              width={1200}
              height={600}
              className="w-full h-auto rounded-2xl"
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