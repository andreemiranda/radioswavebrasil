import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { LucideIcon, ArrowLeft, Calendar } from 'lucide-react';
import { Footer } from './Footer';

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

const LegalPageLayout: React.FC<LegalPageLayoutProps> = ({ title, lastUpdated, icon: Icon, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-brasil-light text-brasil-text-primary flex flex-col font-body">
      {/* Header Gradiente */}
      <div className="bg-gradient-to-br from-brasil-blue to-brasil-light pt-16 pb-24 px-6 relative overflow-hidden border-b border-white/5">
        <div className="max-w-4xl mx-auto relative z-10">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-brasil-text-secondary hover:text-brasil-green transition-colors mb-8 font-bold group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Voltar ao início
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-brasil-surface p-3 rounded-2xl shadow-accent-glow border border-white/10 group">
              <Icon className="text-brasil-green group-hover:scale-110 transition-transform" size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight text-white">{title}</h1>
          </div>

          <div className="flex items-center gap-2 text-brasil-text-secondary/60 text-sm font-medium">
            <Calendar size={14} />
            Última atualização: {lastUpdated}
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brasil-green/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brasil-blue/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </div>

      {/* Main Content */}
      <main className="flex-grow px-6 -mt-12 mb-20 relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/30 mb-4 px-4">
            <Link to="/" className="hover:text-brasil-green transition-colors">Início</Link>
            <span>/</span>
            <span className="text-brasil-green">{title}</span>
          </nav>

          <div className="bg-brasil-surface rounded-3xl shadow-player p-8 md:p-12 border border-white/5 prose prose-invert max-w-none prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-h2:border-l-4 prose-h2:border-brasil-green prose-h2:pl-4 prose-h2:mt-10 prose-a:text-brasil-green prose-a:font-bold hover:prose-a:text-white transition-all">
            {children}

            <div className="mt-16 pt-8 border-t border-white/5 flex justify-center">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-3 bg-brasil-green text-brasil-light font-black px-8 py-4 rounded-2xl hover:bg-white hover:scale-105 active:scale-95 shadow-accent-glow group transition-all"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LegalPageLayout;
