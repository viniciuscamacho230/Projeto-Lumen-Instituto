import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import HomePage from '../home/HomePage';
import { groupBy } from 'lodash';
import { randomColor } from 'randomcolor';
import { useReactToPrint } from 'react-to-print';


const PDFDiagnosticoGeral = () => {
    const { diagnosticoId } = useParams();
    const [diagnostico, setDiagnostico] = useState(null);
    const [empresa, setEmpresas] = useState([]);
    const [formulario, setFormulario] = useState([]);
    const [mediaformularioPerguntaSemaparada, setMediaformularioPerguntaSemaparada] = useState([]);
    const [todasRespostas, setTodasRespostas] = useState([]);
    const [mediaFormularioGeralempresa, setmediaFormularioGeralempresa] = useState([]);
    const [mediaFormularioEmpresa, setMediaFormularioEmpresa] = useState([]);
    const navigate = useNavigate();
    const groupedData = groupBy(mediaFormularioEmpresa, 'formularioId');
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });


    useEffect(() => {
        const getDiagnostico = async () => {
            try {
                const token = localStorage.getItem('token');
                if (diagnosticoId) {
                    const response = await axios.get(`http://localhost:3000/diagnostico/${diagnosticoId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    setDiagnostico(response.data);
                    setFormulario(response.data.formularios)
                }

                const responseEmpresas = await axios.get('http://localhost:3000/empresas', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setEmpresas(responseEmpresas.data.empresas);

            } catch (error) {
                console.error('Erro ao buscar detalhes do diagnóstico:', error);
            }
        };

        const calcularMediaFormularioEmpresa = async () => {
            for (let j = 0; j < empresa.length; j++) {
                for (let i = 0; i < formulario.length; i++) {
                    const token = localStorage.getItem('token');
                    const response = await axios.get(
                        `http://localhost:3000/respostas/empresa/${empresa[j]._id}/formulario/${formulario[i]._id}/diagnostico/${diagnosticoId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );
                    const todasRespostas = response.data.respostas;
                    let soma = 0;
                    todasRespostas.forEach((resposta) => {
                        resposta.respostas.forEach((resposta) => {
                            soma += resposta.pontos;
                        });
                    });
                    const media = soma / (todasRespostas.length * todasRespostas[0].respostas.length);
                    setMediaFormularioEmpresa((prevMedias) => [
                        ...prevMedias,
                        {
                            empresaId: empresa[j]._id,
                            formularioId: formulario[i]._id,
                            media: media,
                            empresa: empresa[j].nome
                        },
                    ]);
                }
            }
        };

        calcularMediaFormularioEmpresa();
        getDiagnostico();
    }, [diagnosticoId]);

    const handleVoltar = () => {
        navigate(-1);
    };

    if (!mediaformularioPerguntaSemaparada) {
        console.log('Teste')
    } else {
        try {
            for (const i = 0; i < mediaformularioPerguntaSemaparada.length; i++) {
                for (const j = 0; j < mediaformularioPerguntaSemaparada.length; j++) {
                }
            }

        } catch {
        }
    }

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
                {Object.entries(groupedData).map(([formularioId, data], index) => (
                    <div key={formularioId}>
                        <h2>Formulário: {formulario[index].titulo}</h2>
                        <ResponsiveContainer width="100%" height={500}>
                            <BarChart
                                data={data.map(item => ({
                                    name: item.empresa,
                                    media: item.media.toFixed(0),
                                }))}
                            >
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="media">
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={randomColor()} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ))}
            </Box>




            {/* <div style={{ display: 'none' }}>
                <div ref={componentRef} style={{ margin: '3rem' }}>
                    {Object.entries(groupedData).map(([formularioId, data]) => (
                        <div key={formularioId}>
                            <h2>Formulário: {formularioId}</h2>
                            <ResponsiveContainer width="100%" height={500}>
                                <BarChart
                                    data={data.map(item => ({
                                        name: item.empresaId,
                                        media: item.media.toFixed(0),
                                    }))}
                                >
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="media">
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={randomColor()} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    ))}
                </div>
            </div> */}



        </div>
    )
}

export default PDFDiagnosticoGeral;