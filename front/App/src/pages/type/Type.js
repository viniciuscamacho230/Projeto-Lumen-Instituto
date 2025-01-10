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

const TiposEmpresas = () => {
  const [types, setTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    totalAnswers: [],
  });
  const [openModal, setOpenModal] = useState(false);
  const [editType, setEditType] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      setIsAdmin(decoded.isAdmin);
    }

    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/types', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTypes(response.data.types);
    } catch (error) {
      console.error('Error fetching types:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/types', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Type created:', response.data.type);
      fetchTypes();
      setOpenModal(false);
    } catch (error) {
      console.error('Error creating type:', error);
    }
  };

  const handleEdit = (type) => {
    setEditType(type);
    setFormData({
      name: type.name,
      description: type.description,
      totalAnswers: type.totalAnswers,
    });
    setOpenModal(true);
  };

  const handleTotalAnswersChange = (index, field, value) => {
    const updatedTotalAnswers = [...formData.totalAnswers];
    updatedTotalAnswers[index][field] = value;
    setFormData({ ...formData, totalAnswers: updatedTotalAnswers });
  };

  const handleAddTotalAnswer = () => {
    setFormData({
      ...formData,
      totalAnswers: [
        ...formData.totalAnswers,
        { minPoints: 0, maxPoints: 0, response: '' },
      ],
    });
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/types/${editType._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Type updated:', response.data.type);
      fetchTypes();
      setOpenModal(false);
      setEditType(null);
    } catch (error) {
      console.error('Error updating type:', error);
    }
  };

  const handleDelete = async (typeId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/types/${typeId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Type deleted');
      fetchTypes();
    } catch (error) {
      console.error('Error deleting type:', error);
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
    setEditType(null);
  };

  const handleRemoveAnswer = (indexToRemove) => {
    const updatedAnswers = formData.totalAnswers.filter((_, index) => index !== indexToRemove);
    setFormData({ ...formData, totalAnswers: updatedAnswers });
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
          <TextField
            type="search"
            label="Pesquisar por Nome"
            name="search"
            sx={{ width: '84%' }}
          />
          <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ width: 'auto', }}>
            Novo tipo
          </Button>
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
              {types.map((type) => (
                <TableRow key={type._id}>
                  <TableCell>{type.name}</TableCell>
                  <TableCell>{type.description}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" onClick={() => handleEdit(type)} sx={{ mr: '1rem', }}>
                      Editar
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleDelete(type._id)}>
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
            <h2>{editType ? 'Editar tipo de formulário' : 'Novo tipo de formulário'}</h2>
            <form onSubmit={editType ? handleUpdateSubmit : handleFormSubmit}>
              <TextField
                type="text"
                label="Name"
                variant="standard"
                name="name"
                value={editType ? formData.name : formData.name}
                onChange={handleInputChange}
                fullWidth
              />
              <TextField
                type="text"
                label="Description"
                variant="standard"
                name="description"
                value={editType ? formData.description : formData.description}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />

              {formData.totalAnswers.map((answer, index) => (
                <div key={index} style={{ display: 'flex', gap: 10, marginBottom: '1rem', marginTop: '1rem' }}>
                  <TextField
                    type="text"
                    label="Resposta final"
                    value={answer.response}
                    variant="standard"
                    fullWidth
                    onChange={(e) => handleTotalAnswersChange(index, 'response', e.target.value)}
                  />
                  <TextField
                    type="number"
                    label="Min pontos"
                    value={answer.minPoints}
                    variant="standard"
                    onChange={(e) => handleTotalAnswersChange(index, 'minPoints', e.target.value)}
                    sx={{ width: 'auto' }}
                  />
                  <TextField
                    type="number"
                    label="Max pontos"
                    value={answer.maxPoints}
                    variant="standard"
                    onChange={(e) => handleTotalAnswersChange(index, 'maxPoints', e.target.value)}
                  />

                  <Button color="error" onClick={() => handleRemoveAnswer(index)}>
                    Excluir
                  </Button>
                </div>

              ))}
              <div style={{display: 'flex', flexDirection: 'column'}}>
                <Button onClick={handleAddTotalAnswer}>Adicionar Resposta final</Button>
                <Button type="submit" variant="contained" color="primary">
                  {editType ? 'Atualizar' : 'Criar'}
                </Button>
              </div>
            </form>
          </Box>
        </Modal>
      </Box>
          )}
    </div>
  );
};

export default TiposEmpresas;
