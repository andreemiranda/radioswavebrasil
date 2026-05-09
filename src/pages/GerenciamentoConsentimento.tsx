import React, { useState, useEffect } from 'react';
import { Settings2, Trash2, Download, ShieldCheck, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import LegalPageLayout from '../components/LegalPageLayout';
import { useNavigate } from 'react-router-dom';

interface ConsentData {
  accepted: boolean;
  timestamp: string;
  version: string;
  categories: {
    essential: boolean;
    functional: boolean;
    thirdParty: boolean;
  }
}

const GerenciamentoConsentimento: React.FC = () => {
  const [consent, setConsent] = useState<ConsentData | null>(null);
  const [showData, setShowData] = useState(false);
  const [allData, setAllData] = useState<Record<string, any>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem('RadioWaveBR_cookieConsent');
    if (raw) setConsent(JSON.parse(raw));

    // Carregar todos os dados do localStorage para visualização
    const data: Record<string, any> = {};
    for (let i = 0; i < localStorage.length; i++) {
       const key = localStorage.key(i);
       if (key && key.startsWith('RadioWaveBR_')) {
          try {
             data[key] = JSON.parse(localStorage.getItem(key) || '');
          } catch {
             data[key] = localStorage.getItem(key);
          }
       }
    }
    setAllData(data);
  }, []);

  const handleClearAll = () => {
     if (window.confirm('Tem certeza que deseja apagar todos os seus dados e favoritos desta rádio? Esta ação não pode ser desfeita.')) {
        Object.keys(localStorage).forEach(key => {
           if (key.startsWith('RadioWaveBR_')) {
              localStorage.removeItem(key);
           }
        });
        window.location.reload();
     }
  };

  const handleExport = () => {
     const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
     const a = document.createElement('a');
     a.href = url;
     a.download = `meus-dados-radiowave-${new Date().toISOString().split('T')[0]}.json`;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     URL.revokeObjectURL(url);
  };

  const handleRevoke = () => {
     localStorage.removeItem('RadioWaveBR_cookieConsent');
     alert('Consentimento revogado. Você será redirecionado para a página inicial.');
     navigate('/');
     window.location.reload();
  };

  return (
    <LegalPageLayout 
      title="Gerenciamento de Privacidade" 
      lastUpdated="06 de maio de 2026" 
      icon={Settings2}
    >
      <div className="space-y-12">
        {/* Status de Consentimento */}
        <section>
          <h2 className="flex items-center gap-2">
            <ShieldCheck size={24} className="text-brasil-green" />
            Status Atual
          </h2>
          <div className={consent ? "bg-green-500/10 border border-green-500/20 p-6 rounded-2xl shadow-inner" : "bg-orange-500/10 border border-orange-500/20 p-6 rounded-2xl shadow-inner"}>
            {consent ? (
              <div className="flex items-center gap-4">
                <CheckCircle2 size={40} className="text-green-400 shrink-0" />
                <div>
                  <p className="font-bold text-green-200">Consentimento Registrado</p>
                  <p className="text-sm text-green-300">Você aceitou os cookies em: {new Date(consent.timestamp).toLocaleString()}</p>
                  <p className="text-xs text-green-400/60 mt-1 uppercase font-black">Versão {consent.version}</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <AlertCircle size={40} className="text-orange-400 shrink-0" />
                <div>
                  <p className="font-bold text-orange-200">Consentimento Pendente</p>
                  <p className="text-sm text-orange-300">Você ainda não configurou suas preferências de privacidade.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Categorias de Cookies */}
        <section>
          <h2 className="mt-0">Categorias de Dados</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
              <div>
                <p className="font-bold text-white text-sm md:text-base">🔒 Essenciais (Obrigatórios)</p>
                <p className="text-xs text-brasil-text-secondary">Volume, favoritos, última estação e decisão de cookies.</p>
              </div>
              <div className="bg-brasil-green/20 text-brasil-green text-[10px] font-black px-2 py-1 rounded border border-brasil-green/30">ATIVO</div>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
               <div>
                 <p className="font-bold text-white text-sm md:text-base">📊 Funcionais (Opcionais)</p>
                 <p className="text-xs text-brasil-text-secondary">Lembrar escolha de não exibir banner de instalação PWA.</p>
               </div>
               <div className="w-12 h-6 bg-white/10 rounded-full relative cursor-not-allowed opacity-50">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white/20 rounded-full"></div>
               </div>
            </div>
          </div>
        </section>

        {/* Ações de Dados */}
        <section>
           <h2>Seus Dados e Controles</h2>
           <p className="text-sm text-brasil-text-secondary mb-6 font-medium leading-relaxed">
             Abaixo você pode visualizar, baixar ou excluir permanentemente todas as informações que o Radio Wave Brasil salvou no seu navegador. <strong>Lembre-se:</strong> uma vez excluídos, seus favoritos não poderão ser recuperados.
           </p>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => setShowData(!showData)}
                className="flex items-center justify-center gap-3 p-4 bg-white/5 hover:bg-white/10 transition-colors rounded-xl font-bold text-white border border-white/5"
              >
                {showData ? 'Esconder meus dados' : 'Ver meus dados salvos'}
              </button>
              
              <button 
                onClick={handleExport}
                className="flex items-center justify-center gap-3 p-4 bg-brasil-green/10 text-brasil-green border border-brasil-green/30 hover:bg-brasil-green hover:text-brasil-light transition-all rounded-xl font-bold"
              >
                <Download size={18} />
                Exportar meus dados (JSON)
              </button>
              
              <button 
                onClick={handleRevoke}
                className="flex items-center justify-center gap-3 p-4 bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500 hover:text-white transition-colors rounded-xl font-bold"
              >
                Revogar Consentimento
              </button>

              <button 
                onClick={handleClearAll}
                className="flex items-center justify-center gap-3 p-4 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors rounded-xl font-bold"
              >
                <Trash2 size={18} />
                Apagar todos os dados
              </button>
           </div>

           {showData && (
              <div className="mt-8 p-6 bg-slate-900 rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
                 <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-4">
                    <span className="text-white/60 text-xs font-black uppercase tracking-widest">JSON Inspector</span>
                    <button onClick={() => setShowData(false)} className="text-white/40 hover:text-white">Fechar</button>
                 </div>
                 <pre className="text-green-400 font-mono text-xs overflow-auto max-h-[400px] leading-relaxed">
                    {JSON.stringify(allData, null, 2)}
                 </pre>
              </div>
           )}
        </section>

        {/* Direito de Titular */}
        <section className="bg-brasil-green/5 p-8 rounded-3xl border border-brasil-green/10">
           <h2 className="mt-0 flex items-center gap-2">
              <Mail size={24} className="text-brasil-green" />
              Exercer seus Direitos
           </h2>
           <p className="text-sm text-brasil-text-secondary leading-relaxed mb-6 font-medium">
             Caso deseje fazer uma solicitação oficial referente aos seus dados, como portabilidade ou eliminação de logs técnicos, clique no botão abaixo para nos enviar um e-mail.
           </p>
           <a 
             href="mailto:legislativomunicipal@aol.com?subject=[LGPD] Solicitação de Direitos do Titular"
             className="inline-flex items-center gap-2 bg-brasil-green text-brasil-light font-bold px-8 py-4 rounded-2xl hover:scale-105 active:scale-95 shadow-accent-glow transition-all"
           >
             Enviar solicitação via E-mail
           </a>
        </section>
      </div>
    </LegalPageLayout>
  );
};

export default GerenciamentoConsentimento;
