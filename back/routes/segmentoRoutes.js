const express = require("express");
const router = express.Router();
const Segmento = require("../models/Segmento");
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

// Rota para criar um novo segmento
router.post("/segmentos", checkToken, async (req, res) => {
  const { name, description } = req.body;

  const newSegmento = new Segmento({
    name,
    description,
  });

  try {
    await newSegmento.save();
    res
      .status(201)
      .json({ msg: "Segmento criado com sucesso!", segmento: newSegmento });
  } catch (error) {
    console.error("Erro ao criar segmento:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Rota para listar todos os segmentos
router.get("/segmentos", checkToken, async (req, res) => {
  try {
    const segmentos = await Segmento.find({});
    res.status(200).json({ segmentos });
  } catch (error) {
    console.error("Erro ao buscar segmentos:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Rota para atualizar informações de um segmento
router.put("/segmentos/:id", checkToken, async (req, res) => {
  const { name, description } = req.body;

  try {
    const updatedSegmento = await Segmento.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );

    if (!updatedSegmento) {
      return res.status(404).json({ msg: "Segmento não encontrado" });
    }

    res
      .status(200)
      .json({
        msg: "Segmento atualizado com sucesso!",
        segmento: updatedSegmento,
      });
  } catch (error) {
    console.error("Erro ao atualizar segmento:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Rota para excluir um segmento
router.delete("/segmentos/:id", checkToken, async (req, res) => {
  try {
    const deletedSegmento = await Segmento.findByIdAndDelete(req.params.id);

    if (!deletedSegmento) {
      return res.status(404).json({ msg: "Segmento não encontrado" });
    }

    res.status(200).json({ msg: "Segmento excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir segmento:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

module.exports = router;
