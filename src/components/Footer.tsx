import React from "react";
import { Radio, Github, Twitter, Instagram, Mail, Shield, FileText, Cookie, Scale, Settings2 } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Modern footer for Radio Wave Brasil
 * Uses the brasil.green theme as requested
 */
export const Footer: React.FC = () => {
  return (
    <footer className="bg-theme-footer text-white border-t border-white/5 px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-theme-primary border border-white/5 shadow-sm transition-all duration-300">
                <Radio size={20} />
              </div>
              <h2 className="text-xl font-display font-bold tracking-tight uppercase">Radio Wave Brasil</h2>
            </div>
            <p className="text-white/50 text-sm max-w-sm leading-relaxed mb-6">
              A melhor experiência de rádios online do Brasil. Streaming premium, interface moderna e performance otimizada para Desktop, Android e iOS.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h3 className="text-theme-primary font-display font-bold uppercase tracking-widest text-[10px] mb-6 opacity-70">Documentos legais</h3>
            <ul className="space-y-4 text-xs font-semibold">
              <li>
                <Link to="/politica-de-privacidade" className="text-white/40 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                  <Shield size={14} className="opacity-40 group-hover:opacity-100" />
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/termos-de-uso" className="text-white/40 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                  <FileText size={14} className="opacity-40 group-hover:opacity-100" />
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/politica-de-cookies" className="text-white/40 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                  <Cookie size={14} className="opacity-40 group-hover:opacity-100" />
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link to="/aviso-legal" className="text-white/40 hover:text-white transition-colors duration-200 flex items-center gap-2 group">
                  <Scale size={14} className="opacity-40 group-hover:opacity-100" />
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link to="/gerenciamento-consentimento" className="inline-flex bg-white/5 border border-white/5 px-3 py-2 rounded-lg hover:bg-white/10 transition-all duration-200 items-center gap-2 group mt-2 text-theme-primary text-[10px] font-bold uppercase tracking-wider">
                  <Settings2 size={14} />
                  Privacidade & Consentimento
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Section */}
          <div>
            <h3 className="text-theme-primary font-display font-bold uppercase tracking-widest text-[10px] mb-6 opacity-70">Conecte-se</h3>
            <div className="flex flex-wrap gap-4">
              <a 
                href="https://instagram.com/andremiranda04" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-theme-primary hover:text-white hover:-translate-y-1 active:scale-95"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://x.com/andremirandaa" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-theme-primary hover:text-white hover:-translate-y-1 active:scale-95"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://github.com/andreemiranda/radioswavebrasil" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-theme-primary hover:text-white hover:-translate-y-1 active:scale-95"
                aria-label="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="mailto:legislativomunicipal@aol.com" 
                className="w-10 h-10 bg-white/5 border border-white/5 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-theme-primary hover:text-white hover:-translate-y-1 active:scale-95"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-theme-border flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
          <div className="flex flex-col md:flex-row items-center gap-4">
             <p>© {new Date().getFullYear()} Radio Wave Brasil</p>
          </div>
          <p className="text-theme-primary">Desenvolvido por André Miranda</p>
        </div>
      </div>
    </footer>
  );
};
