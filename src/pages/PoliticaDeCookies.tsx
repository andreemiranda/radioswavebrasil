import React from 'react';
import { Cookie } from 'lucide-react';
import LegalPageLayout from '../components/LegalPageLayout';
import { Link } from 'react-router-dom';

const PoliticaDeCookies: React.FC = () => {
  return (
    <LegalPageLayout 
      title="Política de Cookies" 
      lastUpdated="06 de maio de 2026" 
      icon={Cookie}
    >
      <h2>1. O que são Cookies?</h2>
      <p>
        Cookies são pequenos arquivos de texto ou chaves de dados salvos no seu navegador para "lembrar" suas preferências e ações. No Radio Wave Brasil, utilizamos a tecnologia de <code>localStorage</code>, que funciona de forma similar aos cookies, permitindo que suas escolhas persistam mesmo após fechar o navegador.
      </p>

      <h2>2. Por que utilizamos?</h2>
      <p>
        Utilizamos estas tecnologias para garantir que você não precise reconfigurar o app toda vez que acessá-lo. Sem eles, seus favoritos seriam perdidos e seu volume voltaria ao padrão a cada carregamento.
      </p>

      <h2>3. Dados que Armazenamos localmente</h2>
      <p>Abaixo listamos todas as chaves de dados que o Radio Wave Brasil salva no seu dispositivo:</p>

      <div className="overflow-x-auto my-6">
        <table className="min-w-full border-collapse border border-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="border border-slate-200 px-4 py-2 text-left text-xs font-black uppercase">Chave</th>
              <th className="border border-slate-200 px-4 py-2 text-left text-xs font-black uppercase">Finalidade</th>
              <th className="border border-slate-200 px-4 py-2 text-left text-xs font-black uppercase">Essencial?</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-slate-200 px-4 py-2 text-sm"><code>RadioWaveBR_lastStation</code></td>
              <td className="border border-slate-200 px-4 py-2 text-sm">Lembra a última rádio que você ouviu.</td>
              <td className="border border-slate-200 px-4 py-2 text-sm font-bold text-brasil-green">SIM</td>
            </tr>
            <tr>
              <td className="border border-slate-200 px-4 py-2 text-sm"><code>RadioWaveBR_volume</code></td>
              <td className="border border-slate-200 px-4 py-2 text-sm">Armazena o seu nível de volume preferido.</td>
              <td className="border border-slate-200 px-4 py-2 text-sm font-bold text-brasil-green">SIM</td>
            </tr>
            <tr>
              <td className="border border-slate-200 px-4 py-2 text-sm"><code>RadioWaveBR_muted</code></td>
              <td className="border border-slate-200 px-4 py-2 text-sm">Lembra se você deixou o som no mudo.</td>
              <td className="border border-slate-200 px-4 py-2 text-sm font-bold text-brasil-green">SIM</td>
            </tr>
            <tr>
              <td className="border border-slate-200 px-4 py-2 text-sm"><code>RadioWaveBR_favorites</code></td>
              <td className="border border-slate-200 px-4 py-2 text-sm">Lista de todas as estações que você favoritou.</td>
              <td className="border border-slate-200 px-4 py-2 text-sm font-bold text-brasil-green">SIM</td>
            </tr>
            <tr>
              <td className="border border-slate-200 px-4 py-2 text-sm"><code>RadioWaveBR_cookieConsent</code></td>
              <td className="border border-slate-200 px-4 py-2 text-sm">Registra se você aceitou ou recusou esta política.</td>
              <td className="border border-slate-200 px-4 py-2 text-sm font-bold text-brasil-green">SIM</td>
            </tr>
            <tr>
              <td className="border border-slate-200 px-4 py-2 text-sm"><code>RadioWaveBR_pwaInstallDismissed</code></td>
              <td className="border border-slate-200 px-4 py-2 text-sm">Evita mostrar o banner de instalação toda hora.</td>
              <td className="border border-slate-200 px-4 py-2 text-sm font-bold text-slate-500">NÃO</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="bg-brasil-light p-4 rounded-xl text-sm border-l-4 border-brasil-yellow">
        <strong>Importante:</strong> Nenhum destes dados é enviado para nossos servidores. Eles permanecem apenas no seu navegador.
      </p>

      <h2>4. Cookies de Terceiros</h2>
      <p>
        Não utilizamos cookies de rastreamento de terceiros (como Google Analytics ou Facebook Pixel). No entanto, serviços de infraestrutura como o <strong>Netlify</strong> (onde o app está hospedado) podem definir cookies técnicos de segurança.
      </p>

      <h2>5. Como Gerenciar?</h2>
      <p>
        Você pode controlar e apagar seus dados a qualquer momento através da nossa <Link to="/gerenciamento-consentimento">Central de Consentimento</Link> ou limpando o histórico/cache do seu navegador.
      </p>
    </LegalPageLayout>
  );
};

export default PoliticaDeCookies;
