import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Box, Button, TextField, FormControl, FormControlLabel, Radio, RadioGroup, Typography } from '@mui/material';
import HomePage from '../home/HomePage';

const RespostaFormularioPage = () => {
  const { id } = useParams();
  const [formulario, setFormulario] = useState(null);
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [types, setTypes] = useState([]);
  const [respostas, setRespostas] = useState({});
  const [answerCorrespondente, setAnswerCorrespondente] = useState(null);
  const [userName, setUserName] = useState('');
  const [lastname, setLastname] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [empresa, setEmpresa] = useState('');

  useEffect(() => {
    const fetchFormulario = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/formularios/${id}`);
        setFormulario(response.data.formulario);
        fetchTypes(response.data.formulario.selectedType);
      } catch (error) {
        console.error('Erro ao buscar detalhes do formulário:', error);
      }
    };

    const fetchTypes = async (typeID) => {
      try {
        console.log('tyspeIsD:', typeID)
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3000/types/${typeID}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTypes([response.data.type]);

      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };
    fetchUsuario();
    fetchFormulario();
  }, [id]);


  const fetchUsuario = async () => {
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
          setEmpresa(response.data.user.empresa);
          console.log('empresa:', empresa)
        })
        .catch(error => {
          console.error('Erro ao buscar usuário:', error);

        });
    }
  };


  const handleRespostaChange = (perguntaId, opcaoEscolhida) => {
    setRespostas((prevRespostas) => ({
      ...prevRespostas,
      [perguntaId]: opcaoEscolhida,
    }));
    fetchUsuario();
  };



  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:3000/respostas',
        {
          nome: userName,
          sobrenome: lastname,
          formularioId: id,
          empresa: empresa,
          respostas: Object.entries(respostas).map(([perguntaId, opcaoEscolhida]) => ({
            pergunta: perguntaId,
            opcaoEscolhida,
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Resposta enviada com sucesso:', response.data);
    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
    }
  };


  const handlerespostahandle = async () => {
    try {

      let pontuacaoTotal = 0;
      formulario.perguntasSelecionadas.forEach((pergunta) => {
        const opcaoEscolhida = respostas[pergunta._id];
        const opcao = pergunta.opcoes_resposta.find((opcao) => opcao._id === opcaoEscolhida);
        pontuacaoTotal += opcao ? opcao.pontos : 0;
      });

      let answerCorrespondente;
      const typeCorrespondente = types.find((type) => {
        return type.totalAnswers.some(answer => {
          const isMatch = pontuacaoTotal >= answer.minPoints && pontuacaoTotal <= answer.maxPoints;
          if (isMatch) {
            answerCorrespondente = answer;
            setAnswerCorrespondente(answerCorrespondente);
          }
          return isMatch;
        });
      });
      console.log('Answer Correspondente:', answerCorrespondente.response);
      console.log('Resposta enviada com sucesso:');


    } catch (error) {
      console.error('Erro ao enviar resposta:', error);
    }
  };

  const handleButtonClick = () => {
    handleSubmit();
    handlerespostahandle();
  };

  if (!formulario) {
    return <p>Carregando formulário...</p>;
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
        }}
      >
        <h1>{formulario.titulo}</h1>
        <h2>Responda ao Formulário</h2>
        <form>

          {formulario.perguntasSelecionadas.map((pergunta) => (
            <div key={pergunta._id}>
              <h3>{pergunta.texto_pergunta}</h3>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label={pergunta.texto_pergunta}
                  name={pergunta._id}
                  value={respostas[pergunta._id] || ''}
                  onChange={(e) => handleRespostaChange(pergunta._id, e.target.value)}
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
            </div>
          ))}
          
          <Button variant="contained" onClick={handleButtonClick}>
            Enviar Respostas
          </Button>
        </form>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <p>Resposta Correspondente:</p>
          {answerCorrespondente && (
            <div>
              <p>{answerCorrespondente.response}</p>
            </div>
          )}
        </div>
      </Box>
    </div>
  );
};

export default RespostaFormularioPage;

