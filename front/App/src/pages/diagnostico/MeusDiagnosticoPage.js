// Importe os módulos necessários do React e MUI
import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import HomePage from '../home/HomePage';
import { useNavigate } from 'react-router-dom';

const MeusDiagnosticosPage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [diagnosticos, setDiagnosticos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    
    const token = localStorage.getItem('token');
    if (token) {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        setIsAdmin(decoded.isAdmin);
    }
    fetchDiagnosticos();
  }, []);

  const fetchDiagnosticos = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      const response = await axios.get(`http://localhost:3000/todos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDiagnosticos(response.data);
    } catch (error) {
      console.error('Erro ao buscar diagnósticos:', error);
    }
  };

  const handleVerDiagnostico = (diagnosticoId) => {
    navigate(`/diagnostico/${diagnosticoId}`);
  };

  const handleExcluirDiagnostico = async (diagnosticoId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/diagnostico/${diagnosticoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchDiagnosticos();
    } catch (error) {
      console.error('Erro ao excluir diagnóstico:', error);
    }
  };

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
          gap: 3,
        }}>
        <div>
          <Button variant='contained' onClick={voltarPaginaAnterior}>Voltar</Button>
        </div>
        <Typography variant="h4" gutterBottom>
          Todos os Diagnósticos
        </Typography>


        <Grid container spacing={2}>

          {diagnosticos.map((diagnostico) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={diagnostico._id}>
              <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <Typography variant="h6" sx={{ mb: 1 }}>{diagnostico.nome}</Typography>
                <Button onClick={() => handleVerDiagnostico(diagnostico._id)} variant="contained" sx={{ width: '100%' }}>Ver diagnóstico</Button>
                <Button variant="contained" sx={{ width: '100%' }} onClick={() => handleExcluirDiagnostico(diagnostico._id)}>Excluir</Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>
      )}
    </div>
  );
};

export default MeusDiagnosticosPage;
