import { jwtDecode } from 'jwt-decode';
import React, { useState, useEffect } from 'react';
import HomePage from '../home/HomePage';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Box,
    Button,
    Grid,
    Typography,
    Paper,
} from '@mui/material';

const MeusFormulariosPage = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [meusFormularios, setMeusFormularios] = useState([]);

    const handleExcluir = async (formularioId) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:3000/formularios/${formularioId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setMeusFormularios((prevFormularios) => prevFormularios.filter((f) => f._id !== formularioId));
        } catch (error) {
            console.error('Erro ao excluir formulário:', error);
        }
    };

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
                    <Button variant="contained" onClick={voltarPaginaAnterior}>Voltar</Button>
                </div>
                <h1>Meus Formulários</h1>
                <Grid container spacing={2}>
                    {meusFormularios.map((formulario) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={formulario._id}>
                            <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ mb: 1 }}>{formulario.titulo}</Typography>
                                <Link to={`/formularios/detalhes/${formulario._id}`}><Button variant="contained" sx={{ width: '100%', mb: 1 }}>Visualizar</Button></Link>
                                <Button variant="contained" onClick={() => handleExcluir(formulario._id)} sx={{ width: '100%', mb: 1 }}>Excluir</Button>
                                <Link to={`/respostas/formulario/${formulario._id}`}><Button variant="contained" sx={{ width: '100%' }}>Ver Respostas</Button></Link>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

            </Box>
            )}
        </div>
    );
};

export default MeusFormulariosPage;
