import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import {
    Box,
    RadioGroup,
    FormControlLabel,
    Radio,
    FormControl,
    Button,
} from '@mui/material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from 'recharts';
import { useReactToPrint } from 'react-to-print';
import HomePage from '../home/HomePage';

const PDFEmpresaDiagnostico = () => {
    const { empresaId, diagnosticoId } = useParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const [resposta, setResposta] = useState(null);
    const [formulario, setFormulario] = useState([]);
    const [mediasPorFormulario, setMediasPorFormulario] = useState([]);
    const [diagnostico, setDiagnostico] = useState([]);
    const componentRef = useRef();
    const navigate = useNavigate();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:3000/diagnostico/${diagnosticoId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setDiagnostico(response.data);
                setFormulario(response.data.formularios);
            } catch (error) {
                console.error('Erro ao buscar detalhes do diagnóstico:', error);
            }
        };

        const fetchTodasRespostas = async () => {
            try {
                for (let i = 0; i < formulario.length; i++) {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(
                        `http://localhost:3000/respostas/empresa/${empresaId}/formulario/${formulario[i]._id}/diagnostico/${diagnosticoId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const todasRespostas = response.data.respostas;

                    const mediasPorPergunta = todasRespostas[0].respostas.map((_, j) => {
                        let soma = 0;
                        todasRespostas.forEach((resposta) => {
                            soma += resposta.respostas[j].pontos;
                        });
                        return soma / todasRespostas.length;
                    });

                    setMediasPorFormulario((prevMedias) => [
                        ...prevMedias,
                        mediasPorPergunta,
                    ]);
                }
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

        fetchData();
        fetchTodasRespostas();
    }, [diagnosticoId, empresaId, formulario.length]);

    if (!formulario || !diagnostico || mediasPorFormulario.length === 0) {
        return <p>Carregando detalhes da resposta...</p>;
    }

    const chartData = [];

    for (let i = 0; i < formulario.length; i++) {
        if (
            !formulario[i] ||
            !formulario[i].perguntasSelecionadas ||
            !mediasPorFormulario[i]
        ) {
            console.error(
                'Dados ausentes para o formulário ou médias:',
                formulario[i],
                mediasPorFormulario[i]
            );
            continue;
        }

        chartData[i] = formulario[i].perguntasSelecionadas.map((pergunta, index) => ({
            name: `${index + 1}`,
            media: mediasPorFormulario[i][index].toFixed(0),
        }));
    }

    const handleVoltar = () => {
        navigate(-1);
    };

    return (
        <div>
            <HomePage></HomePage>
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
                }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button variant="contained" onClick={handleVoltar}>Voltar</Button>
                    <Button variant="contained" onClick={handlePrint}>Gerar PDF</Button>
                </div>
                <h1>Nome do diagnóstico: {diagnostico.nome}</h1>

                {formulario.map((formulario, index) => (
                    <div key={formulario._id}>
                        <h2>Formulario: {formulario.titulo}</h2>
                        {formulario.perguntasSelecionadas.map((pergunta, perguntaIndex) => (
                            <div key={pergunta._id}>
                                <h3>{pergunta.texto_pergunta}</h3>
                                <FormControl component="fieldset">
                                    <RadioGroup
                                        aria-label={pergunta.texto_pergunta}
                                        name={pergunta._id}
                                    >
                                        {pergunta.opcoes_resposta.map((opcao) => (
                                            <FormControlLabel
                                                key={opcao._id}
                                                value={opcao._id}
                                                control={<Radio />}
                                                label={`${opcao.resposta}`}
                                            />
                                        ))}
                                    </RadioGroup>
                                </FormControl>
                                {mediasPorFormulario[index] && (
                                    <p>
                                        Media: {mediasPorFormulario[index][perguntaIndex].toFixed(0)}
                                    </p>
                                )}
                            </div>
                        ))}
                        <BarChart width={260} height={300} data={chartData[index]}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis tickCount={11} minTickGap={1} allowDecimals={false}/>
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="media" fill="#ffa500" />
                        </BarChart>
                    </div>
                ))}
                <div style={{ display: 'none' }}>
                    <div ref={componentRef} style={{ margin: '3rem' }}>
                        <h1>{diagnostico.name}</h1>
                        {formulario.map((formulario, index) => (
                            <div key={formulario._id}>
                                <h2>{formulario._id}</h2>
                                {formulario.perguntasSelecionadas.map((pergunta, perguntaIndex) => (
                                    <div key={pergunta._id}>
                                        <h3>{pergunta.texto_pergunta}</h3>
                                        <FormControl component="fieldset">
                                            <RadioGroup
                                                aria-label={pergunta.texto_pergunta}
                                                name={pergunta._id}
                                            >
                                                {pergunta.opcoes_resposta.map((opcao) => (
                                                    <FormControlLabel
                                                        key={opcao._id}
                                                        value={opcao._id}
                                                        control={<Radio />}
                                                        label={`${opcao.resposta}`}
                                                    />
                                                ))}
                                            </RadioGroup>
                                        </FormControl>
                                        {mediasPorFormulario[index] && (
                                            <p>
                                                Media: {mediasPorFormulario[index][perguntaIndex].toFixed(1)}
                                            </p>
                                        )}
                                    </div>
                                ))}
                                <BarChart width={260} height={300} data={chartData[index]}>
                                    <CartesianGrid strokeDasharray="3 0" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="media" fill="#ffa500" />
                                </BarChart>
                            </div>
                        ))}
                    </div>
                </div>
            </Box>
        </div>
    );
};

export default PDFEmpresaDiagnostico;
