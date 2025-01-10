const express = require("express");
const router = express.Router();
const Formulario = require("../models/Formulario");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "Acesso negado!" });
  }

  try {
    const secret = "minhaChaveSecreta123!";
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido!" });
  }
}

// Listar todos os formulários
router.get("/formularios", checkToken, async (req, res) => {
  try {
    const formularios = await Formulario.find({});
    res.status(200).json({ formularios });
  } catch (error) {
    console.error("Erro ao buscar formulários:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Criar um novo formulário
router.post("/formularios", checkToken, async (req, res) => {
  const { titulo, selectedType, perguntasSelecionadas } = req.body;
  const userId = req.user.id;

  const novoFormulario = new Formulario({
    titulo,
    selectedType,
    perguntasSelecionadas,
    createdBy: userId,
  });

  try {
    await novoFormulario.save();
    res
      .status(201)
      .json({
        msg: "Formulário criado com sucesso!",
        formulario: novoFormulario,
      });
  } catch (error) {
    console.error("Erro ao criar formulário:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Atualizar um formulário existente
router.put("/formularios/:id", checkToken, async (req, res) => {
  const { selectedType, perguntasSelecionadas } = req.body;

  try {
    const formularioAtualizado = await Formulario.findByIdAndUpdate(
      req.params.id,
      { selectedType, perguntasSelecionadas },
      { new: true }
    );

    if (!formularioAtualizado) {
      return res.status(404).json({ msg: "Formulário não encontrado" });
    }

    res
      .status(200)
      .json({
        msg: "Formulário atualizado com sucesso!",
        formulario: formularioAtualizado,
      });
  } catch (error) {
    console.error("Erro ao atualizar formulário:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Excluir um formulário
router.delete("/formularios/:id", checkToken, async (req, res) => {
  try {
    const formularioExcluido = await Formulario.findByIdAndDelete(
      req.params.id
    );

    if (!formularioExcluido) {
      return res.status(404).json({ msg: "Formulário não encontrado" });
    }

    res.status(200).json({ msg: "Formulário excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir formulário:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Listar todos os formulários criados por um usuário
router.get("/formularios/usuario/:userId", checkToken, async (req, res) => {
  try {
    const userId = req.params.userId;
    const formularios = await Formulario.find({ createdBy: userId });

    if (!formularios || formularios.length === 0) {
      return res
        .status(404)
        .json({ msg: "Nenhum formulário encontrado para este usuário." });
    }

    res.status(200).json({ formularios });
  } catch (error) {
    console.error("Erro ao buscar formulários do usuário:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Buscar um formulário específico pelo ID
router.get("/formularios/:id", async (req, res) => {
  try {
    const formularioId = req.params.id;
    const formulario = await Formulario.findById(formularioId);

    if (!formulario) {
      return res.status(404).json({ msg: "Formulário não encontrado." });
    }

    res.status(200).json({ formulario });
  } catch (error) {
    console.error("Erro ao buscar formulário:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

module.exports = router;
