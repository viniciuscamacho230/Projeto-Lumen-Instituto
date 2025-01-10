import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Box, RadioGroup, FormControlLabel, Radio, FormControl } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const DetalhesRespostaPage = () => {
    const { formularioId, respostaId } = useParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const [resposta, setResposta] = useState(null);
    const [formulario, setFormulario] = useState(null);
    const [medias, setMedias] = useState([]);

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

        const fetchFormulario = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/formularios/${formularioId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFormulario(response.data.formulario);
            } catch (error) {
                console.error('Erro ao buscar formulario:', error);
            }
        };

        const fetchTodasRespostas = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`http://localhost:3000/respostas/${formularioId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const todasRespostas = response.data.respostas;

                const medias = todasRespostas[0].respostas.map((_, i) => {
                    let soma = 0;
                    todasRespostas.forEach(resposta => {
                        soma += resposta.respostas[i].pontos;
                    });
                    return soma / todasRespostas.length;
                });

                setMedias(medias);
            } catch (error) {
                console.error('Erro ao buscar todas as respostas:', error);
            }
        };


        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            const userId = decoded.id;
            setIsAdmin(decoded.isAdmin);
        }

        fetchTodasRespostas();
        fetchFormulario();
        fetchRespostaDetalhes();
    }, [formularioId, respostaId]);

    if (!formulario || !resposta) {
        return <p>Carregando detalhes da resposta...</p>;
    }
    const chartData = formulario.perguntasSelecionadas.map((pergunta, index) => ({
        name: `${index + 1}`,
        nota: resposta.respostas[index].pontos,
        media: medias[index]
    }));
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: 'auto',
                backgroundColor: 'white',
                justifyContent: 'center',
                paddingLeft:'2rem',
            }}>
            <h1>Detalhes da Resposta</h1>
            <p>Nome do respondente: {`${resposta.nome} ${resposta.sobrenome}`}</p>
            <h2>Perguntas e Respostas:</h2>

            {formulario.perguntasSelecionadas.map((pergunta, index) => (
                <div key={pergunta._id}>
                    <h3>{index + 1} - {pergunta.texto_pergunta}</h3>
                    <FormControl component="fieldset">
                        <RadioGroup
                            aria-label={pergunta.texto_pergunta}
                            name={pergunta._id}>
                            {pergunta.opcoes_resposta.map((opcao) => (
                                <FormControlLabel
                                    key={opcao._id}
                                    value={opcao._id}
                                    control={
                                        <Radio checked={resposta.respostas[index].resposta === opcao.resposta} />
                                    }
                                    label={`${opcao.resposta}`}
                                />
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <p style={{ fontWeight: 'bold' }}>Nota: {resposta.respostas[index].pontos.toFixed(1)}</p>
                    <p style={{ fontWeight: 'bold' }}>Média: {medias[index].toFixed(0)}</p>

                </div>
            ))}

            <BarChart width={300} height={300} data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickCount={11} minTickGap={1} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="nota" fill="#8884d8" />
                <Bar dataKey="media" fill="#82ca9d" />
            </BarChart>
        </Box>
    );
};

export default DetalhesRespostaPage;
