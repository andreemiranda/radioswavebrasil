import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import PoliticaDePrivacidade from './pages/PoliticaDePrivacidade';
import TermosDeUso from './pages/TermosDeUso';
import PoliticaDeCookies from './pages/PoliticaDeCookies';
import AvisoLegal from './pages/AvisoLegal';
import GerenciamentoConsentimento from './pages/GerenciamentoConsentimento';
import { CookieConsentBanner } from './components/CookieConsentBanner';

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/politica-de-privacidade" element={<PoliticaDePrivacidade />} />
        <Route path="/termos-de-uso" element={<TermosDeUso />} />
        <Route path="/politica-de-cookies" element={<PoliticaDeCookies />} />
        <Route path="/aviso-legal" element={<AvisoLegal />} />
        <Route path="/gerenciamento-consentimento" element={<GerenciamentoConsentimento />} />
      </Routes>
      <CookieConsentBanner />
    </>
  );
};

export default App;
