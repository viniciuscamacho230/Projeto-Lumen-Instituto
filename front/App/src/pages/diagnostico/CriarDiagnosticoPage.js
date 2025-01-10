import React, { useState, useEffect } from 'react';
import { Container, Button, Modal, Box, Typography, Grid, Paper, TextField } from '@mui/material';
import HomePage from '../home/HomePage';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const CriarDiagnosticoPage = () => {
  const [openModal, setOpenModal] = useState(false);
  const [formulariosDisponiveis, setFormulariosDisponiveis] = useState([]);
  const [formulariosSelecionados, setFormulariosSelecionados] = useState([]);
  const [nomeDiagnostico, setNomeDiagnostico] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [meusFormularios, setMeusFormularios] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchMeusFormularios = async () => {
      try {
        const token = localStorage.getItem('token');
        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await axios.get(`http://localhost:3000/formularios/usuario/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setMeusFormularios(response.data.formularios);
      } catch (error) {
        console.error('Erro ao buscar meus formulários:', error);
      }
    };

    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      setIsAdmin(decoded.isAdmin);
    }


    fetchMeusFormularios();
  }, []);

  const handleOpenSuccessModal = () => {
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    window.location.href = '/diagnostico/todos';
  };

  const handleOpenModal = () => {
    const formulariosNaoSelecionados = meusFormularios.filter(
      (formulario) => !formulariosSelecionados.includes(formulario._id)
    );
    setFormulariosDisponiveis(formulariosNaoSelecionados);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleFormularioSelect = (formulario) => {
    setFormulariosSelecionados([...formulariosSelecionados, formulario._id]);
  };


  const handleExcluir = (index) => {
    console.log(formulariosSelecionados)
  };

  const handleSalvarDiagnostico = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/criar',
        {
          nome: nomeDiagnostico,
          formularios: formulariosSelecionados,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Diagnóstico salvo:', response.data);
      handleOpenSuccessModal();
    } catch (error) {
      console.error('Erro ao salvar diagnóstico:', error);
    }
  };

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
          gap: 3,
        }}>
        <Typography variant="h4" gutterBottom>
          Criar Novo Diagnóstico
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button variant="contained" onClick={handleOpenModal}>
            Adicionar Formulários
          </Button>
          <Button variant="contained" onClick={handleSalvarDiagnostico}>
            Salvar Diagnóstico
          </Button>
        </Box>
        <label>
          Nome do Diagnóstico:
          <TextField variant="outlined" sx={{ my: '1rem', width: '100%', }}  type="text" value={nomeDiagnostico} onChange={(e) => setNomeDiagnostico(e.target.value)} />
        </label>
        <Grid container spacing={2}>
          {formulariosSelecionados.map((formulario) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={formulario._id}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ mb: 1 }}>{formulario}</Typography>
                <Button variant="contained" sx={{ width: '100%' }} onClick={() => handleExcluir(formulario._id)}>Remover Formulário</Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      )}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90vw',
            height: '70vh',
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <Grid container spacing={2}>
            {formulariosDisponiveis.map((formulario) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={formulario._id}>
                <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ mb: 1 }}>{formulario.titulo}</Typography>
                  <Button variant="contained" sx={{ width: '100%' }} onClick={() => { handleFormularioSelect(formulario); handleCloseModal(); }}>
                    Selecionar Formulário
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
          <Button variant="contained" onClick={handleCloseModal}>
            Fechar
          </Button>
        </Box>
      </Modal>
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
          <h2>Diagnóstico Salvo com Sucesso</h2>
          <Button variant="contained" onClick={handleCloseSuccessModal}>
            Fechar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default CriarDiagnosticoPage;
