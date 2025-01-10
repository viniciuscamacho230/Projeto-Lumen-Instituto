import React, { useState, useEffect, useRef } from "react";
import HomePage from '../home/HomePage';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import {
  TextField,
  Button,
  Box,
  Typography,
} from '@mui/material';

const Perfil = () => {
  const [userName, setUserName] = useState('');
  const [lastname, setLastname] = useState('');
  const [cpf, setCpf] = useState('');
  const [date, setDate] = useState('');
  const [email, setEmail] = useState('');
  const [civil, setCivil] = useState('');
  const [newPassword, setNewPassword] = useState('')

  const handleChangePassword = () => {
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const userId = decoded.id;
    axios.put(`http://localhost:3000/user/${userId}/change-password`, {
      newPassword: newPassword,
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(response => {
        console.log('Senha alterada com sucesso!', response);
        setNewPassword('');
      })
      .catch(error => {
        console.error('Erro ao alterar senha:', error);
      });
  };

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.id;

      axios.get(`http://localhost:3000/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          setUserName(response.data.user.name);
          setLastname(response.data.user.lastname);
          setEmail(response.data.user.email);
          setCpf(response.data.user.cpf);
          setDate(response.data.user.date);
          setCivil(response.data.user.civil);

        })
        .catch(error => {
          console.error('Erro ao buscar usuário:', error);

        });
    }
    if (!token) {
      window.location.href = '/';
    }
  }, []);

  return (
    <div>
      <HomePage></HomePage>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 'auto',
        backgroundColor: 'white',
        borderRadius: 'xl',
        p: 5,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        margin: '1rem 2rem 1rem 2rem',
        gap: 3,
      }}>
        <img src='/#' style={{ width: '15rem', backgroundColor: 'gray', height: '15rem' }}></img>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '20rem', gap: 40 }}>
            <Typography>Nome: {userName || 'Usuário'}</Typography>
            <Typography>CPF: {cpf || 'Usuário'}</Typography>
            <Typography>Email: {email || 'Usuário'}</Typography>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '20rem', gap: 40 }}>
            <Typography>Sobrenome: {lastname || 'Usuário'}</Typography>
            <Typography>Data de nascimento: {date || 'Usuário'}</Typography>
            <Typography>Estado Civil: {civil || 'Usuário'}</Typography>

          </div>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', width: '30%', height: 'auto', padding: '2rem', gap: 3 }}>
          <Typography>Mudar senha</Typography>
          <TextField
            label="Nova senha"
            variant="outlined"
            type='password'
            sx={{ width: '100%' }}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <Button variant="contained" color="primary" fullWidth onClick={handleChangePassword}>
            Mudar senha
          </Button>

        </Box>
      </Box>
    </div>
  );
};

export default Perfil;
