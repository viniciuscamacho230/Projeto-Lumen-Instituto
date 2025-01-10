import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import HomePage from '../home/HomePage';

import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  Button,
  Box,
} from '@mui/material';

const CadastroSegmento = () => {
  const [segmentos, setSegmentos] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editSegmento, setEditSegmento] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      setIsAdmin(decoded.isAdmin);
    }
    fetchSegmentos();
  }, []);

  const fetchSegmentos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/segmentos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSegmentos(response.data.segmentos);
    } catch (error) {
      console.error('Error fetching segmentos:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/segmentos', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Segmento created:', response.data.segmento);
      fetchSegmentos();
      setOpenModal(false);
    } catch (error) {
      console.error('Error creating segmento:', error);
    }
  };

  const handleEdit = (segmento) => {
    setEditSegmento(segmento);
    setFormData({
      name: segmento.name,
      description: segmento.description,
    });
    setOpenModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/segmentos/${editSegmento._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Segmento updated:', response.data.segmento);
      fetchSegmentos();
      setOpenModal(false);
      setEditSegmento(null);
    } catch (error) {
      console.error('Error updating segmento:', error);
    }
  };

  const handleDelete = async (segmentoId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/segmentos/${segmentoId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Segmento deleted');
      fetchSegmentos();
    } catch (error) {
      console.error('Error deleting segmento:', error);
    }
  };

  const openCreateModal = () => {
    setOpenModal(true);
  };

  const closeCreateModal = () => {
    setOpenModal(false);
    setFormData({
      name: '',
      description: '',
    });
    setEditSegmento(null);
  };

  return (
    <div>
      <HomePage></HomePage>
      {isAdmin && (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: 'auto',
          backgroundColor: 'white',
          borderRadius: 'xl',
          p: 5,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          margin: '1rem 2rem 1rem 2rem',
          gap: 3,
        }}
      >
        <Box sx={{
          display: 'flex', justifyContent: 'end', width: '100%',
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
            <TextField
              type="search"
              label="Pesquisar por Nome"
              name="search"
              sx={{ width: '84%' }}
            />
            <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ width: 'auto', }}>
              Novo segmento
            </Button>
          </Box>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {segmentos.map((segmento) => (
                <TableRow key={segmento._id}>
                  <TableCell>{segmento.name}</TableCell>
                  <TableCell>{segmento.description}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(segmento)} sx={{ mr: '1rem', }}>
                      Editar
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleDelete(segmento._id)}>
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Modal open={openModal} onClose={() => setOpenModal(false)} sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              width: 'auto',
              backgroundColor: 'white',
              borderRadius: 'xl',
              p: 5,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              margin: '1rem 2rem 1rem 2rem',
            }}>
            <h2>{editSegmento ? 'Editar segmento' : 'Novo segmento'}</h2>
            <form onSubmit={editSegmento ? handleUpdateSubmit : handleFormSubmit}>
              <TextField
                type="text"
                label="Name"
                variant="standard"
                name="name"
                value={editSegmento ? formData.name : formData.name}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                type="text"
                label="Description"
                variant="standard"
                name="description"
                value={editSegmento ? formData.description : formData.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <Button type="submit" variant="contained" color="primary">
                {editSegmento ? 'Atualizar' : 'Criar'}
              </Button>
            </form>
          </Box>
        </Modal>
      </Box>
      )}
    </div>
  );
};

export default CadastroSegmento;
