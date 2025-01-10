import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import HomePage from '../home/HomePage';
import axios from 'axios';
import {
  Box,
  Button,
  Modal,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
} from '@mui/material';

const Empresas = () => {
  const [segmentos, setSegmentos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    logo: '',
    cnpj: '',
    nomeDono: '',
    descricao: '',
    segmento: '',
  });
  const [openModal, setOpenModal] = useState(false);
  const [editEmpresa, setEditEmpresa] = useState(null);

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
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      setIsAdmin(decoded.isAdmin);
    }
    fetchEmpresas();
    fetchSegmentos();
  }, []);

  const fetchEmpresas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/empresas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmpresas(response.data.empresas);
    } catch (error) {
      console.error('Error fetching empresas:', error);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3000/empresas',
        {
          ...formData,
          segmento: formData.segmento
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchEmpresas();
      setOpenModal(false);
    } catch (error) {
      console.error('Error creating empresa:', error);
    }
  };


  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/empresas/${editEmpresa._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEmpresas();
      setOpenModal(false);
      setEditEmpresa(null);
    } catch (error) {
      console.error('Error updating empresa:', error);
    }
  };

  const handleDelete = async (empresaId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/empresas/${empresaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEmpresas();
    } catch (error) {
      console.error('Error deleting empresa:', error);
    }
  };

  const openCreateModal = () => {
    setOpenModal(true);
  };

  const closeCreateModal = () => {
    setOpenModal(false);
    setFormData({
      nome: '',
      logo: '',
      cnpj: '',
      nomeDono: '',
      descricao: '',
      segmento: '',
    });
    setEditEmpresa(null);
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
          gap: '2rem',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
          <TextField
            type="search"
            label="Pesquisar por Nome"
            name="search"
            sx={{ width: '84%' }}
          />
          <Button variant="contained" onClick={openCreateModal} sx={{ width: 'auto', }}>
            Criar nova empresa
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Logo</TableCell>
                <TableCell>CNPJ</TableCell>
                <TableCell>Nome do Dono</TableCell>
                <TableCell>Descrição</TableCell>
                <TableCell>Segmento</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {empresas.map((empresa) => (
                <TableRow key={empresa._id}>
                  <TableCell>{empresa.nome}</TableCell>
                  <TableCell>{empresa.logo}</TableCell>
                  <TableCell>{empresa.cnpj}</TableCell>
                  <TableCell>{empresa.nomeDono}</TableCell>
                  <TableCell>{empresa.descricao}</TableCell>
                  <TableCell>
                    {empresa.segmento ? empresa.segmento.name : 'Sem segmento'}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setFormData({
                            nome: empresa.nome,
                            logo: empresa.logo,
                            cnpj: empresa.cnpj,
                            nomeDono: empresa.nomeDono,
                            descricao: empresa.descricao,
                            segmento: empresa.segmento ? empresa.segmento._id : '',
                          });
                          setEditEmpresa(empresa);
                          setOpenModal(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button variant="contained" color="error" onClick={() => handleDelete(empresa._id)}>
                        Excluir
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Modal open={openModal} onClose={closeCreateModal} sx={{
          display: 'flex',
          justifyContent: 'center',
          overflowY: 'scroll',
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
              borderRadius: '10px',
              p: 5,
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              margin: '1rem 2rem 1rem 2rem',
            }}
          >
            <h1>{editEmpresa ? 'Editar Empresa' : 'Nova Empresa'}</h1>
            <div style={{ display: 'flex', gap: 10, width:'100%'}}>
              <TextField
                label="Nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                variant="standard"
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
              <TextField
                label="CNPJ"
                value={formData.cnpj}
                onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                variant="standard"
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
            </div>
            <TextField
              label="Logo"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              variant="standard"
              fullWidth
              sx={{ marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: 10, width:'100%'}}>
              <TextField
                label="Cidade"
                // value={formData.cnpj}
                // onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                variant="standard"
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
              <TextField
                label="Estado"
                // value={formData.cnpj}
                // onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                variant="standard"
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
              <TextField
                label="CEP"
                // value={formData.cnpj}
                // onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                variant="standard"
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, width:'100%' }}>
              <TextField
                label="Endereço"
                // value={formData.cnpj}
                // onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                variant="standard"
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
              <TextField
                label="Número"
                // value={formData.cnpj}
                // onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                variant="standard"
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
              <TextField
                label="Bairro"
                // value={formData.cnpj}
                // onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                variant="standard"
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10, width:'100%' }}>
              <TextField
                label="Telefone"
                // value={formData.cnpj}
                // onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                variant="standard"
                fullWidth
                sx={{ marginBottom: '1rem' }}
              />
              <TextField
                label="Email"
                // value={formData.cnpj}
                // onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                variant="standard"
                fullWidth
                sx={{ marginBottom: '1rem',}}
              />
            </div>
            <TextField
              label="Nome do Dono"
              value={formData.nomeDono}
              onChange={(e) => setFormData({ ...formData, nomeDono: e.target.value })}
              variant="standard"
              fullWidth
              sx={{ marginBottom: '1rem' }}
              />
            <div style={{ display: 'flex', gap: 10, width:'100%' }}>
            <TextField
              label="Descrição"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              variant="standard"
              fullWidth
              sx={{ marginBottom: '1rem' }}
            />
            <TextField
              label="Segmento"
              select
              value={formData.segmento}
              onChange={(e) => setFormData({ ...formData, segmento: e.target.value })}
              variant="standard"
              fullWidth
              sx={{ marginBottom: '1rem' }}
            >
              {segmentos.map((segmento) => (
                <MenuItem key={segmento._id} value={segmento._id}>
                  {segmento.name}
                </MenuItem>
              ))}
            </TextField>
            </div>
            <Button
              variant="contained"
              color="primary"
              onClick={editEmpresa ? handleUpdateSubmit : handleFormSubmit}
              sx={{ width: '180px', mt: 3 }}
            >
              {editEmpresa ? 'Atualizar empresa' : 'Adicionar empresa'}
            </Button>
          </Box>
        </Modal>
      </Box>
      )}
    </div>
  );
};

export default Empresas;
