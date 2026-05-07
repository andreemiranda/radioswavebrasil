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
    <div className="min-h-screen bg-brasil-light text-slate-800 flex flex-col font-body">
      {/* Header Gradiente */}
      <div className="bg-gradient-to-br from-brasil-green to-brasil-blue text-white pt-16 pb-24 px-6 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors mb-8 font-bold group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Voltar ao início
          </button>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-brasil-yellow p-3 rounded-2xl shadow-lg rotate-3 group">
              <Icon className="text-brasil-green -rotate-3 group-hover:scale-110 transition-transform" size={32} />
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight">{title}</h1>
          </div>

          <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
            <Calendar size={14} />
            Última atualização: {lastUpdated}
          </div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brasil-yellow/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brasil-blue/20 rounded-full blur-3xl -ml-48 -mb-48"></div>
      </div>

      {/* Main Content */}
      <main className="flex-grow px-6 -mt-12 mb-20 relative z-20">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 mb-4 px-4">
            <Link to="/" className="hover:text-white">Início</Link>
            <span>/</span>
            <span className="text-brasil-yellow">{title}</span>
          </nav>

          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100 prose prose-slate max-w-none prose-headings:font-display prose-headings:font-black prose-headings:tracking-tight prose-h2:border-l-4 prose-h2:border-brasil-green prose-h2:pl-4 prose-h2:mt-10 prose-a:text-brasil-green prose-a:font-bold hover:prose-a:text-brasil-blue transition-all">
            {children}

            <div className="mt-16 pt-8 border-t border-slate-100 flex justify-center">
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-3 bg-brasil-green text-white font-black px-8 py-4 rounded-2xl hover:bg-brasil-blue transition-all hover:scale-105 active:scale-95 shadow-xl group"
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
