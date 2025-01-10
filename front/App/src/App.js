import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Perguntas from './pages/perguntas/Perguntas';
import LoginPage from './pages/login/LoginPage';
import HomePage from './pages/home/HomePage';
import Formularios from './pages/formularios/Formularios';
import Usuarios from './pages/modelo/Modelo'
import Type from './pages/type/Type'
import Segmentos from './pages/segmentos/Segmentos'
import Empresa from './pages/empresa/Empresa'
import Perfil from './pages/perfil/Perfil'
import DetalhesFormularioPage from './pages/formularios/DetalhesFormularioPage';
import MeusFormulariosPage from './pages/formularios/MeusFormulariosPage';
import RespostaFormularioPage from './pages/formularios/RespostaFormularioPage';
import VisualizarRespostasPage from './pages/formularios/VisualizarRespostasPage';
import DetalhesRespostaPage from './pages/formularios/DetalhesRespostaPage';
import CriarDiagnosticoPage from './pages/diagnostico/CriarDiagnosticoPage';
import MeusDiagnosticoPage from './pages/diagnostico/MeusDiagnosticoPage';
import DetalhesDiagnosticoPage from './pages/diagnostico/DetalhesDiagnosticoPage';
import Dashboards from './pages/dashboards/Dashboards'
import ResponderDiagnosticoPage from './pages/diagnostico/ResponderDiagnosticoPage';
import DetalhesDiagnosticoEmpresaPage from './pages/diagnostico/DetalhesDiagnosticoEmpresaPage';
import VisualizarRespostasDiagnosticoPage from './pages/diagnostico/VisualizarRespostasDiagnosticoPage';
import PDFRespostas from './pages/formularios/PDFRespostas';
import PDFrespostadiagnostico from './pages/diagnostico/PDFrespostadiagnostico';
import PDFEmpresaDiagnostico from './pages/diagnostico/PDFEmpresaDiagnostico';
import PDFDiagnosticoGeral from './pages/diagnostico/PDFDiagnosticoGeral';

const App = () => {

  return (
    <Router>
      <Routes>
        <Route path="/perguntas" element={<Perguntas />}></Route>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/home" element={<HomePage />}></Route>
        <Route path="/form" element={<Formularios />}></Route>
        <Route path="/usuario" element={<Usuarios />}></Route>
        <Route path="/type" element={<Type />}></Route>
        <Route path="/segmento" element={<Segmentos />}></Route>
        <Route path="/empresa" element={<Empresa />}></Route>
        <Route path="/perfil" element={<Perfil />}></Route>
        <Route path="/formularios" element={<MeusFormulariosPage />} />
        <Route path="/formularios/detalhes/:id" element={<DetalhesFormularioPage />} />
        <Route path="/formularios/responder/:id" element={<RespostaFormularioPage />} />
        <Route path="/respostas/formulario/:formularioId" element={<VisualizarRespostasPage />} />
        <Route path="/respostas/detalhes/:formularioId/:respostaId" element={<DetalhesRespostaPage />} />
        <Route path="/diagnostico/criar" element={<CriarDiagnosticoPage />} />
        <Route path="/diagnostico/todos" element={<MeusDiagnosticoPage />} />
        <Route path="/diagnostico/:id" element={<DetalhesDiagnosticoPage />} />
        <Route path="/dashboards" element={<Dashboards />} />
        <Route path="/diagnostico/responder/:id" element={<ResponderDiagnosticoPage/>} />
        <Route path="/diagnostico/detalhes/:idDiagnostico/:idEmpresa" element={<DetalhesDiagnosticoEmpresaPage/>} />
        <Route path="/respostas/empresa/:empresaId/formulario/:formularioId/diagnostico/:diagnosticoId" element={<VisualizarRespostasDiagnosticoPage/>} />
        <Route path="/respostas/PDF/detalhes/:formularioId/:respostaId" element={<PDFRespostas />} />
        <Route path="/respostas/PDF/detalhes/:formularioId/:empresaId/:diagnosticoId" element={<PDFrespostadiagnostico />} />
        <Route path="/respostas/PDF/:diagnosticoId/:empresaId" element={<PDFEmpresaDiagnostico />} />
        <Route path='/respostas/PDF/geral/diagnostico/:diagnosticoId' element={<PDFDiagnosticoGeral/>}/>
      </Routes>
    </Router>
  );
};

export default App;
