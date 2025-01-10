import React, { useState, useEffect } from 'react';
import HomePage from '../home/HomePage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {
  Box,
  Button,
  Modal,
  Paper,
  Typography,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  styled,
} from '@mui/material';

const Relatorio = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openTipoModal, setOpenTipoModal] = useState(true);
  const [perguntas, setPerguntas] = useState([]);
  const [perguntasSelecionadas, setPerguntasSelecionadas] = useState([]);
  const [pontosSelecionados, setPontosSelecionados] = useState(0);
  const [pontosPorPergunta, setPontosPorPergunta] = useState({});
  const [pontosTotais, setPontosTotais] = useState(0);
  const [tipos, setTipos] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [valor, setValor] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [perguntasRemovidas, setPerguntasRemovidas] = useState([]);
  const HoverBox = styled(Box)({
    transition: 'border-color 0.6s ease',
    '&:hover': {
      transition: 'border-color 0.6s ease',
      border: '0.2rem solid white',
      borderRadius: '5px',
      backgroundColor: '#FAFAFA',
    },
    transition: 'background-color 0.6s ease',
  });
  const [formularioData, setFormularioData] = useState({
    titulo: '',
    selectedType: '',
    perguntasSelecionadas: [],
  });

  const handleOpenSuccessModal = () => {
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    window.location.href = '/formularios';
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    // Restaurar perguntas removidas ao conjunto de perguntas disponíveis
    setPerguntas([...perguntas, ...perguntasRemovidas]);
    setPerguntasRemovidas([]);
  };

  const handleOpenTipoModal = () => {
    setOpenTipoModal(true);
    setPerguntasSelecionadas([]);
  };

  const handleCloseTipoModal = () => {
    if (!selectedType) {
      setOpenTipoModal(true);
    } else {
      setOpenTipoModal(false);
    }
  };
  const [formularioSalvo, setFormularioSalvo] = useState(false);
  const saveFormulario = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      const dataToSend = {
        titulo: formularioData.titulo,
        selectedType: selectedType,
        perguntasSelecionadas: perguntasSelecionadas,
        userId: userId,
      };
      const response = await axios.post('http://localhost:3000/formularios', dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Formulário salvo:', response.data);
      setFormularioSalvo(true);
      handleOpenSuccessModal();
    } catch (error) {
      console.error('Erro ao salvar o formulário:', error);
    }
  };

  const handleTypeSelection = async (type) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/perguntas/${type}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPerguntas(response.data.perguntas);
      setSelectedType(type);
      setOpenTipoModal(false);
    } catch (error) {
      console.error('Erro ao buscar perguntas por tipo:', error);
    }
  };


  const fetchTipos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/types', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTipos(response.data.types);
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  const handlePerguntaClick = (pergunta) => {
    setPerguntasSelecionadas([...perguntasSelecionadas, pergunta]);
    setValor([...valor, pergunta.opcoes_resposta]);
  };

  const handleRemoverPergunta = (pergunta) => {
    setPerguntasSelecionadas(perguntasSelecionadas.filter((p) => p !== pergunta));
    setPerguntasRemovidas([...perguntasRemovidas, pergunta]);
  };

  const fetchPerguntas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/perguntas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.perguntas;
    } catch (error) {
      console.error('Erro ao buscar perguntas:', error);
      return [];
    }
  };

  useEffect(() => {
    const getPerguntas = async () => {
      const perguntasData = await fetchPerguntas();
      setPerguntas(perguntasData);
    };

    const token = localStorage.getItem('token');
    if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        setIsAdmin(decoded.isAdmin);
    }

    getPerguntas();
    fetchTipos();
  }, []);
  return (
    // Não coloquei a verificação de isAdmin aqui ainda
    <div>
      <HomePage></HomePage>
      {openTipoModal ? (
        <Modal open={openTipoModal} onClose={handleCloseTipoModal} sx={{
          overflowY: 'scroll',
          display: 'flex',
          justifyContent: 'center',
          overflowY: 'scroll',
          alignItems: 'center',
        }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: 'white',
              p: 5,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              margin: '1rem 2rem 1rem 2rem',
              borderRadius: '10px',
            }}
          >
            <h2>Selecione um tipo</h2>
            <div style={{ display: 'flex', gap: 10, }}>
              {tipos.map((tipo) => (
                <Button
                  key={tipo._id}
                  variant="outlined"
                  onClick={() => handleTypeSelection(tipo._id)}
                >
                  {tipo.name}
                </Button>
              ))}
            </div>
          </Box>
        </Modal>
      ) : (
        selectedType && (
          <Box>
            <Box sx={{ margin: '0 2rem 0 2rem', display: 'flex', height: 'auto', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: '2rem', gap: '2rem' }}>
              <a style={{ textDecoration: 'none' }} onClick={handleOpenTipoModal} href='#'>Escolha de tipo</a>
              <a style={{ textDecoration: 'none' }} href='#'>Criação do formulário</a>
              <a style={{ textDecoration: 'none' }} href='#'>Salvar formulário</a>
              <a style={{ textDecoration: 'none' }} href='#'>Testar formulário</a>
              <a style={{ textDecoration: 'none' }} href='#'>Compartilhar formulário</a>
            </Box>
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
              }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', }}>

                <Button variant="contained" onClick={handleOpenModal}>
                  Adicionar Pergunta
                </Button>
                <Button variant="contained" onClick={saveFormulario}>
                  Salvar Formulário
                </Button>
              </Box>
              <Paper sx={{ p: 8 }}>
                <Box sx={{ display: 'flex', width: '100%', justifyContent: 'center', mb: 5 }}>
                  <TextField
                    type="text"
                    variant="outlined" sx={{ my: '1rem', width: '100%', }}
                    label="Título"
                    InputProps={{
                      inputProps: { style: { textAlign: 'center' } },
                    }}
                    value={formularioData.titulo}
                    onChange={(e) => setFormularioData({ ...formularioData, titulo: e.target.value })}
                  />
                </Box>
                {perguntasSelecionadas.length > 0 &&
                  perguntasSelecionadas.map((perguntaSelecionada, index) => (
                    <div key={index} style={{ marginBottom: '1rem' }}>
                      <Typography variant="h5">{perguntaSelecionada.texto_pergunta}</Typography>
                      <ul
                        name="perguntas"
                        onChange={(event) => {
                          const pontosDaResposta = parseInt(event.target.value);
                          setPontosPorPergunta({
                            ...pontosPorPergunta,
                            [perguntaSelecionada._id]: pontosDaResposta,
                          });
                        }}
                      >
                        {perguntaSelecionada.opcoes_resposta.map((resposta, index) => (
                          <li
                          key={index}
                          value={resposta.pontos}
                          control={<Radio />}
                          label={resposta.resposta}
                          >{resposta.resposta}</li>
                          ))}
                      </ul>
                          <Button variant="outlined" onClick={() => handleRemoverPergunta(perguntaSelecionada)}>Remover Pergunta</Button>
                    </div>
                  ))}
              </Paper>
              {/* <Typography variant="body1">
                Pontos totais: {Object.values(pontosPorPergunta).reduce((acc, pontos) => acc + pontos, 0)}
              </Typography> */}
              <Modal open={openModal} onClose={handleCloseModal} sx={{ overflowY: 'scroll' }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'white',
                    borderRadius: 'xl',
                    borderRadius: '10px',
                    p: 5,
                    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                    margin: '1rem 2rem 1rem 2rem',
                    gap: 5,
                  }}
                >
                  <h2>Selecione uma pergunta</h2>
                  {perguntas
                    .filter((pergunta) => !perguntasSelecionadas.includes(pergunta))
                    .map((pergunta) => (
                      <HoverBox
                        key={pergunta._id}
                        sx={{
                          height: 'auto',
                          p: 3,
                          cursor: 'pointer',
                        }}
                        onClick={() => handlePerguntaClick(pergunta)}
                      >
                        <div style={{ width: '80vw' }} onClick={handleCloseModal}>
                          <Typography variant="h6">{pergunta.texto_pergunta}</Typography>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {pergunta.opcoes_resposta.map((opcao) => (
                              <Box
                                key={opcao.resposta}
                                sx={{
                                  border: '1px solid #000',
                                  padding: '10px',
                                  borderRadius: '5px',
                                }}
                              >
                                <RadioGroup name="respostas">
                                  <FormControlLabel
                                    value={opcao.resposta}
                                    control={<Radio />}
                                    label={opcao.resposta}
                                  />
                                </RadioGroup>
                              </Box>
                            ))}
                          </Box>
                        </div>
                      </HoverBox>
                    ))}
                  <Button variant="contained" onClick={handleCloseModal}>
                    Fechar
                  </Button>
                </Box>
              </Modal>

            </Box>
          </Box>

        )
      )}
      <Modal open={showSuccessModal} onClose={handleCloseSuccessModal} sx={{ overflowY: 'scroll' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 'xl',
            borderRadius: '10px',
            p: 5,
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            margin: '1rem 2rem 1rem 2rem',
            gap: 5,
          }}
        >
          <h2>Formulário Salvo com Sucesso</h2>
          <Button variant="contained" onClick={handleCloseSuccessModal}>
            Fechar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};
export default Relatorio;
