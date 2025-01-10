import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import HomePage from '../home/HomePage';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
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
  FormControl,
  Select,
  MenuItem,
} from '@mui/material';



const Usuarios = () => {
  const [empresas, setEmpresas] = useState([]);
  const [segmentos, setSegmentos] = useState([]);
  const [users, setUsers] = useState([]);
  const [value, setValue] = useState()
  const [openModal, setOpenModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    cpf: '',
    civil: '',
    email: '',
    date: '',
    password: '',
    empresa: '',
    dono: '',
  });

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

  const fetchEmpresa = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/empresas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEmpresas(response.data.empresas);
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
    fetchUsers();
    fetchEmpresa();
    fetchSegmentos();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:3000/users', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User created:', response.data.user);
      fetchUsers();
      setOpenModal(false);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setFormData({
      name: user.name,
      lastname: user.lastname,
      cpf: user.cpf,
      civil: user.civil,
      email: user.email,
      date: user.date,
      empresa: user.empresa,
      password: user.password,
      dono: user.dono,

    });
    setOpenModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:3000/users/${editUser._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User updated:', response.data.user);
      fetchUsers();
      setOpenModal(false);
      setEditUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('User deleted');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const openCreateModal = () => {
    setOpenModal(true);
  };

  const handleCivilChange = (e) => {
    setFormData({ ...formData, civil: e.target.value });
  };

  const handleDonoChange = (e) => {
    setFormData({ ...formData, dono: e.target.value });
  };

  const closeCreateModal = () => {
    setOpenModal(false);
    setFormData({
      name: '',
      lastname: '',
      cpf: '',
      civil: '',
      date: '',
      email: '',
      empresa: '',
      password: '',
      dono: '',
    });
    setEditUser(null);
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
            display: 'flex', width: '100%', alignItems: 'center', justifyContent: 'space-between',
          }}>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', gap: '1rem' }}>
              <TextField
                type="search"
                label="Pesquisar por Nome"
                name="search"
                sx={{ width: '87%' }}
              />
              <Button variant="contained" onClick={openCreateModal} sx={{ width: 'auto', }}>
                Novo Usuário
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Sobrenome</TableCell>
                  <TableCell>CPF</TableCell>
                  <TableCell>Estado Civíl</TableCell>
                  <TableCell>Data de nascimento</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.lastname}</TableCell>
                    <TableCell>{user.cpf}</TableCell>
                    <TableCell>{user.civil}</TableCell>
                    <TableCell>{user.date}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleEdit(user)} sx={{ mr: '1rem', }}>
                        Editar
                      </Button>
                      <Button variant="contained" color="error" onClick={() => handleDelete(user._id)}>
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Modal open={openModal} onClose={closeCreateModal} sx={{
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
                borderRadius: '10px',
                p: 5,
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                margin: '1rem 2rem 1rem 2rem',
              }}>
              <h2>{editUser ? 'Editar usuário' : 'Novo usuário'}</h2>
              <form onSubmit={editUser ? handleUpdateSubmit : handleFormSubmit}>
                <div style={{ display: 'flex', gap: 10, }}>
                  <TextField
                    type="text"
                    label="Name"
                    name="name"
                    variant="standard"
                    value={editUser ? formData.name : formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    margin='normal'
                  />
                  <TextField
                    type="text"
                    label="Lastname"
                    name="lastname"
                    variant="standard"
                    value={editUser ? formData.lastname : formData.lastname}
                    onChange={handleInputChange}
                    fullWidth
                    margin='normal'
                  />
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'end', }}>
                  <TextField
                    type="text"
                    label="cpf"
                    name="cpf"
                    variant="standard"
                    value={editUser ? formData.cpf : formData.cpf}
                    onChange={handleInputChange}
                    fullWidth
                    margin='normal'
                  />
                  <FormControl
                    style={{ width: '100%' }}
                    margin='normal'
                    labelId="civil"
                    variant="standard"
                    id="civil"
                    label="Estado Civil"
                    value={editUser ? formData.civil : formData.civil}
                  >
                    <Select onChange={handleCivilChange}>
                      <MenuItem value={'Solteiro'}> Solteiro</MenuItem>
                      <MenuItem value={'Casado'}>Casado </MenuItem>
                      <MenuItem value={'Viúvo'}>Viúvo  </MenuItem>
                      <MenuItem value={'Divorciado'}>Divorciado </MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'end', paddingTop: '1rem', }}>
                  <div style={{ width: '100%', }}>
                    <label >Data de nascimento</label>
                    <input type='date' name="date"
                      value={editUser ? formData.date : formData.date}
                      onChange={handleInputChange}
                      fullWidth
                      margin='normal'
                      style={{ width: '100%', border: '0 none', borderBottom: 'solid gray 1px', }}
                    >
                    </input>
                  </div>
                  <div style={{ width: '100%', }}>
                    <label >Número de Celular</label>
                    <PhoneInput
                      type="text"
                      value={value}
                      onChange={setValue}
                      label="Celular"
                      name="tel"
                      // variant="standard"
                      // value={editUser ? formData.cpf : formData.cpf}
                      // onChange={handleInputChange}
                      fullWidth
                      margin='normal'
                      style={{ width: '100%', border: '0 none', }}
                    /></div>
                </div>
                <TextField
                  type="email"
                  label="Email"
                  name="email"
                  variant="standard"
                  value={editUser ? formData.email : formData.email}
                  onChange={handleInputChange}
                  fullWidth
                  margin='normal'
                />
                <TextField
                  type="password"
                  label="Password"
                  name="password"
                  variant="standard"
                  value={editUser ? formData.password : formData.password}
                  onChange={handleInputChange}
                  fullWidth
                  margin='normal'
                />
                <FormControl
                  sx={{ width: '100%' }}
                  labelId="dono"
                  id="dono"
                  label="Dono"
                  value={editUser ? formData.dono : formData.dono}
                >
                  <Select onChange={handleDonoChange}>
                    <MenuItem value={'true'}>Dono</MenuItem>
                    <MenuItem value={'false'}>Funcionário</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  label="empresa"
                  select
                  value={formData.empresa}
                  onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
                  variant="standard"
                  fullWidth
                  sx={{ marginBottom: '1rem', }}
                >
                  {empresas.map((empresa) => (
                    <MenuItem key={empresa._id} value={empresa._id}>
                      {empresa.nome}
                    </MenuItem>
                  ))}
                </TextField>
                <Button type="submit" variant="contained" color="primary" fullWidth>
                  {editUser ? 'Atualizar' : 'Criar'}
                </Button>
              </form>
            </Box>
          </Modal>
        </Box>
      )}
    </div>
  );
};

export default Usuarios;