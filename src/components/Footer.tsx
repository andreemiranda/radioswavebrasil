import React from "react";
import { Radio, Github, Twitter, Instagram, Mail } from "lucide-react";

/**
 * Modern footer for Radio Wave Brasil
 * Uses the brasil.green theme as requested
 */
export const Footer: React.FC = () => {
  return (
    <footer className="bg-brasil-green text-brasil-white border-t border-black/10 px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-brasil-yellow rounded-lg flex items-center justify-center text-brasil-green shadow-[0_2px_10px_rgba(255,223,0,0.4)] hover:shadow-[0_4px_20px_rgba(255,223,0,0.6)] transition-all duration-300 hover:scale-110">
                <Radio size={18} />
              </div>
              <h2 className="text-xl font-display font-black tracking-tight">Radio Wave Brasil</h2>
            </div>
            <p className="text-brasil-white/60 text-sm max-w-sm leading-relaxed font-medium">
              A maior rede de rádios online do Brasil. Ouça suas estações favoritas
              em qualquer lugar, com som cristalino e zero anúncios chatos.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-brasil-yellow font-display font-bold uppercase tracking-widest text-xs mb-5">Navegação</h3>
            <ul className="space-y-3 text-sm font-semibold">
              <li>
                <a href="#" className="hover:text-brasil-yellow transition-colors duration-200 inline-flex items-center gap-1 group">
                  <span className="relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-brasil-yellow after:transition-all after:duration-300 group-hover:after:w-full">
                    Página Inicial
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brasil-yellow transition-colors duration-200 inline-flex items-center gap-1 group">
                  <span className="relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-brasil-yellow after:transition-all after:duration-300 group-hover:after:w-full">
                    Sobre Nós
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brasil-yellow transition-colors duration-200 inline-flex items-center gap-1 group">
                  <span className="relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-brasil-yellow after:transition-all after:duration-300 group-hover:after:w-full">
                    Contato
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-brasil-yellow transition-colors duration-200 inline-flex items-center gap-1 group">
                  <span className="relative after:absolute after:bottom-[-2px] after:left-0 after:w-0 after:h-[2px] after:bg-brasil-yellow after:transition-all after:duration-300 group-hover:after:w-full">
                    Política de Privacidade
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h3 className="text-brasil-yellow font-display font-bold uppercase tracking-widest text-xs mb-5">Siga-nos</h3>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com/andremiranda04" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-brasil-yellow hover:text-brasil-green hover:scale-115 hover:shadow-[0_4px_20px_rgba(255,223,0,0.4)] hover:rotate-6"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://x.com/andremirandaa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-brasil-yellow hover:text-brasil-green hover:scale-115 hover:shadow-[0_4px_20px_rgba(255,223,0,0.4)] hover:rotate-6"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://github.com/andreemiranda/radioswavebrasil" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-brasil-yellow hover:text-brasil-green hover:scale-115 hover:shadow-[0_4px_20px_rgba(255,223,0,0.4)] hover:rotate-6"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="mailto:legislativemunicipal@aol.com" 
                className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-brasil-yellow hover:text-brasil-green hover:scale-115 hover:shadow-[0_4px_20px_rgba(255,223,0,0.4)] hover:rotate-6"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-black/20 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase tracking-widest opacity-60">
          <p>© {new Date().getFullYear()} Radio Wave Brasil. Todos os direitos reservados.</p>
          <p>Desenvolvido por André Miranda</p>
        </div>
      </div>
    </footer>
  );
};
