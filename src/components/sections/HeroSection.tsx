import { Button } from "@/components/ui/button";
import { ArrowRight, Github, BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-20 left-10 w-72 h-72 bg-brand-blue/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-purple/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-8 lg:px-12 py-20 relative z-10 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-bold text-brand-gray leading-tight">
                Transforme qualquer site em uma{" "}
                <span className="bg-gradient-primary bg-clip-text text-transparent">
                  thumbnail profissional
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-brand-light-gray leading-relaxed max-w-2xl">
                Snap. Style. Share. Crie capturas de tela elegantes, prontas para portfolios, redes sociais e apresentações.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="lg" className="text-lg px-8 py-4 h-14">
                Comece Agora
                <ArrowRight className="w-5 h-5" />
              </Button>
              
              <Button variant="outline_hero" size="lg" className="text-lg px-8 py-4 h-14" asChild>
                <Link href="/docs">
                  <BookOpen className="w-5 h-5" />
                  Ver Documentação
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-6 pt-8">
              <div className="flex items-center gap-2 text-brand-light-gray">
                <Github className="w-5 h-5" />
                <span className="text-sm">Open Source</span>
              </div>
              <div className="w-1 h-1 bg-brand-light-gray rounded-full"></div>
              <div className="text-sm text-brand-light-gray">
                Gratuito para sempre
              </div>
            </div>
          </div>
          
          {/* Hero Image */}
          <div className="relative">
            <div className="relative animate-float">
              <Image 
                src="/hero-mockup.jpg"
                alt="Snap tool transforming website screenshot" 
                width={600}
                height={400}
                className="w-full h-auto rounded-2xl shadow-brand"
                priority
              />
              <div className="absolute inset-0 bg-gradient-primary opacity-10 rounded-2xl"></div>
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 w-12 h-12 bg-brand-blue rounded-full animate-pulse-glow"></div>
            <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-brand-purple rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;