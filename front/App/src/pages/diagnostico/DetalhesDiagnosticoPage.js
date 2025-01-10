import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import HomePage from '../home/HomePage';

const DetalhesDiagnosticoPage = () => {
    const [diagnostico, setDiagnostico] = useState(null);
    const { id } = useParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const [empresas, setEmpresas] = useState([]);

    
    console.log(id);

    useEffect(() => {
        const fetchDiagnostico = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/diagnostico/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const responseEmpresas = await axios.get('http://localhost:3000/empresas', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEmpresas(responseEmpresas.data.empresas);
                setDiagnostico(response.data);
            } catch (error) {
                console.error('Erro ao buscar detalhes do diagnóstico:', error);
            }
        };

        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.id;
            setIsAdmin(decoded.isAdmin);
        }

        fetchDiagnostico();
    }, [id]);
    const teste = () => {
        console.log(diagnostico)
    }



    const handleResponderDiagnostico = () => {
        navigate(`/diagnostico/responder/${id}`);
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
                        gap: 6,
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant='contained' onClick={voltarPaginaAnterior}>Voltar</Button>
                        <div style={{display:'flex', gap:'1rem'}}>
                            <Button variant="contained" onClick={handleResponderDiagnostico}>Responder Diagnóstico</Button>
                            <Link to={`/respostas/PDF/geral/diagnostico/${id}`}> <Button variant="contained">Gerar PDF</Button></Link>
                        </div>
                    </div>

                    <Typography variant="h4" gutterBottom>
                        Detalhes do Diagnóstico
                    </Typography>
                    {diagnostico && (
                        <>
                            <Typography variant="h5">{diagnostico.nome}</Typography>
                            <Typography variant="h6">Formulários associados:</Typography>
                            <Grid container spacing={2}>
                                {diagnostico.formularios.map((formulario) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={formulario._id}>
                                        <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                            <Typography variant="h6" sx={{ mb: 1 }}>{formulario._id}</Typography>
                                            <Link to={`/formularios/detalhes/${formulario._id}`}><Button variant="contained" sx={{ width: '100%' }}>Visualizar</Button></Link>
                                            <Link to={`/respostas/formulario/${formulario._id}`}><Button variant="contained" sx={{ width: '100%' }}>Ver Respostas</Button></Link>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                    <Typography variant="h4" gutterBottom>Empresas participantes</Typography>
                    <Grid container spacing={2}>
                        {empresas.map((empresa) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={empresa._id}>
                                <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <Typography variant="h6" sx={{ mb: 1 }}>{empresa.nome}</Typography>
                                    <Link to={`/diagnostico/detalhes/${id}/${empresa._id}`}><Button variant="contained" sx={{ width: '100%' }}>Detalhes</Button></Link>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </div>
    );
};

export default DetalhesDiagnosticoPage;
