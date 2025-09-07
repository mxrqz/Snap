"use client";

import { Button } from "@/components/ui/button";
import { Github, BookOpen, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const navigation = [
    { name: "Recursos", href: "#recursos" },
    { name: "Exemplos", href: "#exemplos" },
    { name: "Casos de Uso", href: "#casos-uso" },
    { name: "Editor", href: "/editor" },
    { name: "Documentação", href: "/docs" }
  ];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-8 lg:px-12 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
            <span className="text-xl font-bold text-brand-gray">Snap</span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-brand-light-gray hover:text-brand-blue transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            
            <Button variant="outline_hero" size="sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Docs
            </Button>
            
            <Button variant="hero" size="sm">
              Começar
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-brand-gray"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4 mb-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-brand-light-gray hover:text-brand-blue transition-colors duration-200 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>
            
            <div className="flex flex-col gap-3">
              <Button variant="ghost" className="justify-start">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              
              <Button variant="outline_hero" className="justify-start">
                <BookOpen className="w-4 h-4 mr-2" />
                Documentação
              </Button>
              
              <Button variant="hero">
                Começar Agora
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;