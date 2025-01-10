import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
  Typography,
  Button,
  Box,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import HomePage from '../home/HomePage';
import { useNavigate } from 'react-router-dom';


const ResponderDiagnosticoPage = () => {
  const [indiceFormularioAtual, setIndiceFormularioAtual] = useState(0);
  const [formulariosDoDiagnostico, setFormulariosDoDiagnostico] = useState([]);
  const [respostas, setRespostas] = useState([]);
  const { id } = useParams();
  const [userName, setUserName] = useState('');
  const [lastname, setLastname] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [indice, setIndice] = useState(['']);
  const [idIndice, setIdIndice] = useState('');
  const [formularioAtualId, setFormularioAtualId] = useState(null);
  const [isLastForm, setIsLastForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFormulariosDiagnostico = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/diagnostico/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const diagnostico = response.data;
        setFormulariosDoDiagnostico(diagnostico.formularios);
        setRespostas(new Array(diagnostico.formularios.length).fill({}));
        setFormularioAtualId(diagnostico.formularios[indiceFormularioAtual]._id);
      } catch (error) {
        console.error('Erro ao buscar formulários do diagnóstico:', error);
      }
    };

    const fetchUsuario = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        axios.get(`http://localhost:3000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(response => {
            setUserName(response.data.user.name);
            setLastname(response.data.user.lastname);
            setEmail(response.data.user.email);
            setCpf(response.data.user.cpf);
            setEmpresa(response.data.user.empresa);
          })
          .catch(error => {
            console.error('Erro ao buscar usuário:', error);
          });
      }
    };

    fetchFormulariosDiagnostico();
    fetchUsuario();
  }, [id, indiceFormularioAtual]);

  useEffect(() => {
    setIsLastForm(indiceFormularioAtual === formulariosDoDiagnostico.length - 1);
  }, [indiceFormularioAtual, formulariosDoDiagnostico]);

  const handleRespostaChange = (perguntaId, resposta) => {
    setRespostas((prevRespostas) => ({
      ...prevRespostas,
      [perguntaId]: resposta,
    }));
  };

  const handleProximoFormulario = () => {
    if (indiceFormularioAtual < formulariosDoDiagnostico.length - 1) {
      setFormularioAtualId(formulariosDoDiagnostico[indiceFormularioAtual + 1]._id);
      setIndiceFormularioAtual((prevIndice) => prevIndice + 1);
    }
  };

  const handleAnteriorFormulario = () => {
    if (indiceFormularioAtual > 0) {
      setIndiceFormularioAtual((prevIndice) => prevIndice - 1);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    navigate('/home');
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:3000/respostasdiagnostico',
        {
          nome: userName,
          sobrenome: lastname,
          formularioId: formularioAtualId,
          diagnostico: id,
          empresa: empresa,
          respostas: formulariosDoDiagnostico[indiceFormularioAtual]?.perguntasSelecionadas.map((pergunta) => ({
            pergunta: pergunta._id,
            opcaoEscolhida: respostas[pergunta._id],
            texto_pergunta: pergunta.texto_pergunta,
            resposta: respostas[pergunta._id],
            pontos: 0,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Resposta enviada com sucesso:', response.data);

      handleProximoFormulario();

      if (isLastForm) {
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
    }
  };

  return (
    <div>
      <HomePage />
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
          gap: 3,
        }}
      >
        <Typography variant="h4">Responder Formulário</Typography>
        <Typography variant="h5">Formulário: {formulariosDoDiagnostico[indiceFormularioAtual]?.titulo}</Typography>
        {formulariosDoDiagnostico[indiceFormularioAtual]?.perguntasSelecionadas.map((pergunta) => (
          <div key={pergunta._id}>
            <h3>{pergunta.texto_pergunta}</h3>
            <FormControl component="fieldset">
              <RadioGroup
                aria-label={pergunta.texto_pergunta}
                name={pergunta._id}
                value={respostas[pergunta._id] || ''}
                onChange={(e) => handleRespostaChange(pergunta._id, e.target.value)}
              >
                {pergunta.opcoes_resposta.map((opcao) => (
                  <FormControlLabel
                    key={opcao._id}
                    value={opcao._id}
                    control={<Radio />}
                    label={`${opcao.resposta}`}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </div>
        ))}
        <Button variant="contained" onClick={handleSubmit}>
          {indiceFormularioAtual === formulariosDoDiagnostico.length - 1
            ? 'Finalizar'
            : 'Próximo formulário'}
        </Button>
      </Box>

      {/* Modal */}
      <Dialog open={isModalOpen} onClose={handleModalClose}>
        <DialogTitle>Todas as respostas foram respondidas</DialogTitle>
        <DialogContent>
          <Typography variant="body1">Você concluiu todos os formulários.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ResponderDiagnosticoPage;
