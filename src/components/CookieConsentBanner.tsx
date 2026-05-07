import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, X, Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';

export const CookieConsentBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('RadioWaveBR_cookieConsent');
    if (!consent) {
      // Pequeno delay para não aparecer imediatamente
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    const consent = {
      accepted: true,
      timestamp: new Date().toISOString(),
      version: "1.0",
      categories: {
        essential: true,
        functional: true,
        thirdParty: true
      }
    };
    localStorage.setItem('RadioWaveBR_cookieConsent', JSON.stringify(consent));
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    const consent = {
      accepted: false,
      timestamp: new Date().toISOString(),
      version: "1.0",
      categories: {
        essential: true,
        functional: false,
        thirdParty: false
      }
    };
    localStorage.setItem('RadioWaveBR_cookieConsent', JSON.stringify(consent));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[400] p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-4xl mx-auto bg-brasil-green text-white rounded-2xl shadow-[0_10px_50px_rgba(0,0,0,0.3)] border border-white/10 overflow-hidden">
        <div className="p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8">
          <div className="bg-white/10 p-3 rounded-xl shrink-0">
            <Shield className="text-brasil-yellow" size={28} />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-black mb-1">Privacidade & Cookies</h3>
            <p className="text-sm text-white/80 leading-relaxed font-medium">
              Usamos cookies essenciais para salvar suas preferências (volume, favoritos, última estação). 
              Cookies opcionais nos ajudam a melhorar o serviço. Ao continuar, você concorda com nossa{' '}
              <Link to="/politica-de-cookies" className="text-brasil-yellow hover:underline font-bold">
                Política de Cookies
              </Link>.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <Link 
              to="/gerenciamento-consentimento"
              className="flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
            >
              <Settings2 size={14} />
              Personalizar
            </Link>
            <button
              onClick={handleRejectNonEssential}
              className="text-xs font-bold px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              Recusar
            </button>
            <button
              onClick={handleAcceptAll}
              className="bg-brasil-yellow text-brasil-green text-sm font-black px-6 py-2.5 rounded-xl hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95 shadow-lg flex-1 md:flex-none"
            >
              Aceitar Tudo
            </button>
          </div>

          <button 
            onClick={() => setIsVisible(false)}
            className="hidden md:flex absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
