import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LoginPage = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(localStorage.getItem('token'));
      console.log(decoded);
      navigate('/home');
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        name: username,
        password: password,
      });

      const token = response.data.token;

      localStorage.setItem('token', token);
      const decoded = jwtDecode(localStorage.getItem('token'));
      console.log(decoded)
      const headers = {
        Authorization: 'Bearer ' + token,
      };
      axios.get(`http://localhost:3000/user/${decoded.id}`, { headers }).then(function (response) { });

      setErrorMessage('');
      setSuccessMessage('Autenticação realizada com sucesso');

      navigate('/home');
    } catch (error) {
      if (error.response && error.response.data) {
        const errorMsg = error.response.data.msg;
        setErrorMessage(errorMsg);
        setSuccessMessage('');
      } else {
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '300px',
          padding: '4rem',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <form>
            <h1>Bem vindo  👋🏻</h1>
            <span >{errorMessage && (<div sx={{ color: 'red', margin: '1em', }} >{errorMessage}</div>)}
              {successMessage && (<div className="text-green-500 text-center mb-4">{successMessage}</div>)}</span>
            <TextField label="Usuário" variant="outlined" id="username" name="username" value={username} onChange={(e) => setUsername(e.target.value)} sx={{ my: '1rem', width: '100%', }} />
            <TextField label="Senha" type="password" variant="outlined" id="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: '1rem', width: '100%', }} />
            <Button variant="contained" color="primary" onClick={handleLogin} type='submit' sx={{ mb: '1rem', width: '100%', }}>
              Entrar
            </Button>
          </form>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
