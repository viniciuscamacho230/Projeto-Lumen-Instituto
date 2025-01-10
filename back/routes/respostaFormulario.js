const express = require('express');
const router = express.Router();
const RespostaFormulario = require('../models/RespostaFormulario');
const Formulario = require('../models/Formulario');
const Pergunta = require('../models/Pergunta');

// Rota para salvar uma resposta
router.post('/respostas', async (req, res) => {
  const { nome, sobrenome, formularioId, respostas, empresa } = req.body;

  try {
    const formularioExistente = await Formulario.findById(formularioId);

    if (!formularioExistente) {
      return res.status(404).json({ msg: 'Formulário não encontrado' });
    }

    const respostasCompletas = [];

    for (const respostaItem of respostas) {
      const perguntaExistente = await Pergunta.findById(respostaItem.pergunta);

      if (!perguntaExistente) {
        return res.status(400).json({ msg: 'Pergunta inválida' });
      }

      const opcaoExistente = perguntaExistente.opcoes_resposta.find(
        (opcao) => opcao._id.toString() === respostaItem.opcaoEscolhida
      );

      if (!opcaoExistente) {
        return res.status(400).json({ msg: 'Resposta inválida para a pergunta' });
      }

      respostasCompletas.push({
        pergunta: respostaItem.pergunta,
        opcaoEscolhida: respostaItem.opcaoEscolhida,
        texto_pergunta: perguntaExistente.texto_pergunta,
        resposta: opcaoExistente.resposta,
        pontos: opcaoExistente.pontos,
      });
    }

    const novaResposta = new RespostaFormulario({
      nome,
      sobrenome,
      empresa,
      formulario: formularioId,
      respostas: respostasCompletas,
    });

    await novaResposta.save();

    res.status(201).json({ msg: 'Resposta salva com sucesso!', resposta: novaResposta });
  } catch (error) {
    console.error('Erro ao salvar resposta:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});


// Rota para obter todas as respostas de um formulário específico
router.get('/respostas/:formularioId', async (req, res) => {
  const formularioId = req.params.formularioId;

  try {
    const respostas = await RespostaFormulario.find({ formulario: formularioId });
    res.status(200).json({ respostas });
  } catch (error) {
    console.error('Erro ao obter respostas:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

// Obter respostas para um formulário
router.get('/respostas/formulario/:formularioId', async (req, res) => {
  try {
      const formularioId = req.params.formularioId;
      const respostas = await RespostaFormulario.find({ formulario: formularioId });
      res.status(200).json({ respostas });
  } catch (error) {
      console.error('Erro ao obter respostas do formulário:', error);
      res.status(500).json({ msg: 'Erro no servidor' });
  }
});

// Obter uma resposta específica de um formulário
router.get('/respostas/formulario/:formularioId/:respostaId', async (req, res) => {
  try {
    const formularioId = req.params.formularioId;
    const respostaId = req.params.respostaId;

    const resposta = await RespostaFormulario.findOne({ _id: respostaId, formulario: formularioId });

    if (!resposta) {
      return res.status(404).json({ msg: 'Resposta não encontrada' });
    }

    res.status(200).json({ resposta });
  } catch (error) {
    console.error('Erro ao obter resposta do formulário:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

// Rota para obter respostas por empresa e formulário
router.get('/respostas/empresa/:empresaId/formulario/:formularioId', async (req, res) => {
  try {
    const empresaId = req.params.empresaId;
    const formularioId = req.params.formularioId;

    const respostas = await RespostaFormulario.find({ empresa: empresaId, formulario: formularioId });

    if (!respostas || respostas.length === 0) {
      return res.status(404).json({ msg: 'Respostas não encontradas para a empresa e formulário especificados' });
    }

    res.status(200).json({ respostas });
  } catch (error) {
    console.error('Erro ao obter respostas por empresa e formulário:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

// Rota para obter respostas por empresa, formulário e diagnóstico
router.get('/respostas/empresa/:empresaId/formulario/:formularioId/diagnostico/:diagnosticoId', async (req, res) => {
  try {
    const empresaId = req.params.empresaId;
    const formularioId = req.params.formularioId;
    const diagnosticoId = req.params.diagnosticoId;

    const respostas = await RespostaFormulario.find({ empresa: empresaId, formulario: formularioId, diagnostico: diagnosticoId });

    if (!respostas || respostas.length === 0) {
      return res.status(404).json({ msg: 'Respostas não encontradas para a empresa, formulário e diagnóstico especificados' });
    }

    res.status(200).json({ respostas });
  } catch (error) {
    console.error('Erro ao obter respostas por empresa, formulário e diagnóstico:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});


// Rota para salvar uma resposta com referência ao diagnóstico
router.post('/respostasdiagnostico', async (req, res) => {
  const { nome, sobrenome, formularioId, respostas, empresa, diagnostico } = req.body;

  try {
    const formularioExistente = await Formulario.findById(formularioId);

    if (!formularioExistente) {
      return res.status(404).json({ msg: 'Formulário não encontrado' });
    }

    const respostasCompletas = [];

    for (const respostaItem of respostas) {
      const perguntaExistente = await Pergunta.findById(respostaItem.pergunta);

      if (!perguntaExistente) {
        return res.status(400).json({ msg: 'Pergunta inválida' });
      }

      const opcaoExistente = perguntaExistente.opcoes_resposta.find(
        (opcao) => opcao._id.toString() === respostaItem.opcaoEscolhida
      );

      if (!opcaoExistente) {
        return res.status(400).json({ msg: 'Resposta inválida para a pergunta' });
      }

      respostasCompletas.push({
        pergunta: respostaItem.pergunta,
        opcaoEscolhida: respostaItem.opcaoEscolhida,
        texto_pergunta: perguntaExistente.texto_pergunta,
        resposta: opcaoExistente.resposta,
        pontos: opcaoExistente.pontos,
      });
    }

    const novaResposta = new RespostaFormulario({
      nome,
      sobrenome,
      empresa,
      diagnostico,
      formulario: formularioId,
      respostas: respostasCompletas,
    });

    await novaResposta.save();

    res.status(201).json({ msg: 'Resposta salva com sucesso!', resposta: novaResposta });
  } catch (error) {
    console.error('Erro ao salvar resposta:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});



module.exports = router;
