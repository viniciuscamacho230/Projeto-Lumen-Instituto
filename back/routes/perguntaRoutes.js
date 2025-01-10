const express = require("express");
const router = express.Router();
const Pergunta = require("../models/Pergunta");
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
    jwt.verify(token, secret);
    next();
  } catch (error) {
    res.status(400).json({ msg: "Token inválido!" });
  }
}

router.post("/perguntas", checkToken, async (req, res) => {
  const { texto_pergunta, tipo, opcoes_resposta } = req.body;

  try {
    const novaPergunta = new Pergunta({
      texto_pergunta,
      tipo,
      opcoes_resposta,
    });

    await novaPergunta.save();
    res
      .status(201)
      .json({
        msg: "Pergunta adicionada com sucesso!",
        pergunta: novaPergunta,
      });
  } catch (error) {
    console.error("Erro ao adicionar pergunta:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

router.get("/perguntas", checkToken, async (req, res) => {
  try {
    const perguntas = await Pergunta.find({});
    res.status(200).json({ perguntas });
  } catch (error) {
    console.error("Erro ao buscar perguntas:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

router.delete("/perguntas/:id", checkToken, async (req, res) => {
  try {
    const deletedPergunta = await Pergunta.findByIdAndDelete(req.params.id);

    if (!deletedPergunta) {
      return res.status(404).json({ msg: "Pergunta não encontrada" });
    }

    res.status(200).json({ msg: "Pergunta excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir pergunta:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

router.put("/perguntas/:id", checkToken, async (req, res) => {
  try {
    const perguntaId = req.params.id;
    const { texto_pergunta, tipo, opcoes_resposta } = req.body;

    const updatedPergunta = await Pergunta.findByIdAndUpdate(
      perguntaId,
      { texto_pergunta, tipo, opcoes_resposta },
      { new: true }
    );

    if (!updatedPergunta) {
      return res.status(404).json({ msg: "Pergunta não encontrada" });
    }

    res
      .status(200)
      .json({
        msg: "Pergunta atualizada com sucesso!",
        pergunta: updatedPergunta,
      });
  } catch (error) {
    console.error("Erro ao atualizar pergunta:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

router.get("/perguntas/:tipo", checkToken, async (req, res) => {
  const tipo = req.params.tipo;

  try {
    const perguntas = await Pergunta.find({ tipo: tipo });
    res.status(200).json({ perguntas });
  } catch (error) {
    console.error("Erro ao buscar perguntas por tipo:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

module.exports = router;
