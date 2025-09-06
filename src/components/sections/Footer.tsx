import { Github, BookOpen, Heart, ExternalLink } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const links = [
    { name: "Documentação", href: "#", icon: BookOpen },
    { name: "GitHub", href: "#", icon: Github },
    { name: "Contribuir", href: "#", icon: ExternalLink },
    { name: "Licença", href: "#", icon: ExternalLink }
  ];
  
  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-8 lg:px-12 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-2xl font-bold text-brand-gray">Snap</span>
            </div>
            <p className="text-brand-light-gray mb-6 max-w-md">
              Transforme capturas de tela em thumbnails profissionais. 
              Gratuito, open source e feito para criadores.
            </p>
            <div className="flex items-center gap-2 text-sm text-brand-light-gray">
              <span>Feito com</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>pela comunidade</span>
            </div>
          </div>
          
          {/* Links */}
          <div>
            <h3 className="font-semibold text-brand-gray mb-4">Recursos</h3>
            <ul className="space-y-3">
              {links.slice(0, 2).map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="flex items-center gap-2 text-brand-light-gray hover:text-brand-blue transition-colors duration-200"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-brand-gray mb-4">Comunidade</h3>
            <ul className="space-y-3">
              {links.slice(2).map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="flex items-center gap-2 text-brand-light-gray hover:text-brand-blue transition-colors duration-200"
                  >
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-brand-light-gray text-sm">
              © {currentYear} Snap. Todos os direitos reservados.
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 bg-gradient-card px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs text-brand-light-gray">Open Source</span>
              </div>
              
              <a 
                href="#" 
                className="text-brand-light-gray hover:text-brand-blue transition-colors duration-200"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;