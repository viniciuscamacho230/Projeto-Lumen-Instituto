import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import HomePage from '../home/HomePage';
import { jwtDecode } from 'jwt-decode';
import { Box, Button } from '@mui/material';

const DetalhesRespostaPage = () => {
    const { formularioId, respostaId } = useParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const [resposta, setResposta] = useState(null);

    useEffect(() => {
        const fetchRespostaDetalhes = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/respostas/formulario/${formularioId}/${respostaId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setResposta(response.data.resposta);
            } catch (error) {
                console.error('Erro ao buscar detalhes da resposta:', error);
            }
        };

        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.id;
            setIsAdmin(decoded.isAdmin);
        }

        fetchRespostaDetalhes();
    }, [formularioId, respostaId]);

    if (!resposta) {
        return <p>Carregando detalhes da resposta...</p>;
    }

    const voltarPaginaAnterior = () => {
        window.history.back();
    }
    const downloadPDF = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.id;
            const response = await fetch(`http://localhost:3000/gerar-pdf/${formularioId}/${respostaId}`, {
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
                    }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Button variant="contained" onClick={voltarPaginaAnterior}>Voltar</Button>
                        <Button variant="contained" onClick={downloadPDF}>Gerar PDF</Button>
                    </div>
                    <h1>Detalhes da Resposta</h1>
                    <p>Nome: {`${resposta.nome} ${resposta.sobrenome}`}</p>
                    <p>Formulário Respondido: {resposta.formulario}</p>
                    <h2>Perguntas e Respostas:</h2>
                    {resposta.respostas.map((respostaPergunta, index) => (
                        <div key={index}>
                            <p>
                                {index + 1}. {respostaPergunta.texto_pergunta}
                            </p>
                            <p>Resposta Selecionada: {respostaPergunta.resposta}</p>
                        </div>
                    ))}
                </Box>
            )}
        </div>
    );
};

export default DetalhesRespostaPage;
