import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import HomePage from '../home/HomePage';
import { Box, Button, Grid, Typography, Paper } from '@mui/material';


const VisualizarRespostasPage = () => {
    const [respostas, setRespostas] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const id = useParams();
    const formularioId = id.formularioId;
    useEffect(() => {
        const fetchRespostas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/respostas/${formularioId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRespostas(response.data.respostas);
            } catch (error) {
                console.error('Erro ao buscar respostas:', error);
            }
        };

        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.id;
            setIsAdmin(decoded.isAdmin);
        }

        fetchRespostas();
    }, [formularioId]);

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
                    }}
                >
                    <div>
                        <Button variant="contained" onClick={voltarPaginaAnterior}>Voltar</Button>
                    </div>
                    <h1>Respostas do Formulário</h1>
                    <Grid container spacing={2}>
                        {respostas.map((resposta) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={resposta._id}>
                                <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', }}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>{resposta.nome} {resposta.sobrenome}</Typography>
                                    <Link to={`/respostas/detalhes/${formularioId}/${resposta._id}`}><Button variant="contained" sx={{ width: '100%' }} >Ver Resposta</Button>
                                    </Link>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </div>
    );
};

export default VisualizarRespostasPage;