// DetalhesFormularioPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import HomePage from '../home/HomePage';
import axios from 'axios';
import { Box, Button } from '@mui/material';

const DetalhesFormularioPage = () => {
  const { id } = useParams();
  const [formulario, setFormulario] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [linkResposta, setLinkResposta] = useState('');

  useEffect(() => {
    const fetchFormularioDetalhes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (id) {
          const response = await axios.get(`http://localhost:3000/formularios/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setFormulario(response.data.formulario);
          console.log(formulario)
          const baseUrl = window.location.origin;
          const link = `${baseUrl}/formularios/responder/${id}`;
          setLinkResposta(link);
        }
      } catch (error) {
        console.error('Erro ao buscar detalhes do formulário:', error);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        setIsAdmin(decoded.isAdmin);
    }

    fetchFormularioDetalhes();
  }, [id]);

  if (!formulario) {
    return <p>Carregando detalhes do formulário...</p>;
  }

  const voltarPaginaAnterior = () => {
    window.history.back();
  }

  return (
    <div>
      <HomePage></HomePage>
      {isAdmin && (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 'auto',
          backgroundColor: 'white',
          borderRadius: 'xl',
          p: 5,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          margin: '1rem 2rem 1rem 2rem',
        }}
      >
        <div>
          <Button variant='contained'onClick={voltarPaginaAnterior}>Voltar</Button>
        </div>
        <h1>Detalhes do Formulário</h1>
        <p>Título: {formulario.titulo}</p>
        <p>Criado por: {formulario.createdBy}</p>

        <h2>Perguntas:</h2>
        {formulario.perguntasSelecionadas.map((pergunta, index) => (
          <div key={index}>
            <p>
              {index + 1}. {pergunta.texto_pergunta}
            </p>
            <ul>
              {pergunta.opcoes_resposta.map((opcao, opcaoIndex) => (
                <li key={opcaoIndex}>
                  {opcao.resposta} - Pontos: {opcao.pontos}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <Box sx={{ display: 'flex', gap: 5 }}>
          {linkResposta && (
            <p>
              <strong>Link de Resposta:</strong>{' '}
              <a href={linkResposta} target="_blank" rel="noopener noreferrer">
                {linkResposta}
              </a>
            </p>
          )}
          <Button variant="contained" onClick={() => navigator.clipboard.writeText(linkResposta)}>
            Copiar Link de Resposta
          </Button>
        </Box>
      </Box>
      )}
    </div>
  );
};

export default DetalhesFormularioPage;
