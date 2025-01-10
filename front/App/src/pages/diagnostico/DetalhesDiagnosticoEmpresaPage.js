import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Typography, Button, Grid, Paper, Box } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import HomePage from '../home/HomePage';


const DetalhesDiagnosticoEmpresaPage = () => {
    const { idDiagnostico, idEmpresa } = useParams();
    const [formularios, setFormularios] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [diagnostico, setDiagnostico] = useState(null);
    const diagnosticoId = idDiagnostico;
    const empresaId = idEmpresa;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/diagnostico/${idDiagnostico}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
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

        fetchData();
    }, [idDiagnostico, idEmpresa]);

    const handleVerDiagnostico = () => {
        navigate(`/respostas/PDF/${idDiagnostico}/${idEmpresa}`);
    };


    const downloadPDF = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.id;
            const response = await fetch(`http://localhost:3000/gerar-pdf/diagnostico/${diagnosticoId}/${empresaId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'resposta.pdf');
            link.click();

        }
    };

    const handleVoltar = () => {
        navigate(-1);
    };



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
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" onClick={handleVoltar}>Voltar</Button>
                        <Button variant="contained" onClick={handleVerDiagnostico}>Gerar PDF</Button>
                    </div>
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
                                            <Link to={`/respostas/empresa/${idEmpresa}/formulario/${formulario._id}/diagnostico/${idDiagnostico}`}><Button variant="contained" sx={{ width: '100%' }}>Ver Respostas</Button></Link>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>
                        </>
                    )}
                </Box>
            )}
        </div>
    );
};

export default DetalhesDiagnosticoEmpresaPage;
