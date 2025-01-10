const express = require('express');
const router = express.Router();
const Formulario = require('../models/Formulario');
const Resposta = require('../models/Resposta');

// Criar uma resposta para um formulário
router.post('/formularios/responder/:id', async (req, res) => {
  const { userId, respostas } = req.body;

  try {
    const formularioId = req.params.id;
    const formulario = await Formulario.findById(formularioId);

    if (!formulario) {
      return res.status(404).json({ msg: 'Formulário não encontrado.' });
    }

    const novaResposta = new Resposta({
      formularioId,
      userId,
      respostas,
    });

    await novaResposta.save();

    res.status(201).json({ msg: 'Respostas salvas com sucesso!', resposta: novaResposta });
  } catch (error) {
    console.error('Erro ao salvar respostas:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});

// Listar respostas de um formulário específico
router.get('/formularios/:id/respostas', async (req, res) => {
  try {
    const formularioId = req.params.id;
    const respostas = await Resposta.find({ formularioId }).populate('userId');

    if (respostas.length === 0) {
      return res.status(404).json({ msg: 'Nenhuma resposta encontrada para o formulário.' });
    }

    res.status(200).json({ respostas });
  } catch (error) {
    console.error('Erro ao buscar respostas:', error);
    res.status(500).json({ msg: 'Erro no servidor' });
  }
});


module.exports = router;
