const express = require("express");
const router = express.Router();
const Type = require("../models/Type");
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

// Listar todos os tipos de empresa
router.get("/types", checkToken, async (req, res) => {
  try {
    const types = await Type.find({});
    res.status(200).json({ types });
  } catch (error) {
    console.error("Erro ao buscar tipos de empresas:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Criar um novo tipo de empresa
router.post("/types", checkToken, async (req, res) => {
  const { name, description, totalAnswers } = req.body;

  const newType = new Type({
    name,
    description,
    totalAnswers,
  });

  try {
    await newType.save();
    res
      .status(201)
      .json({ msg: "Tipo de empresa criado com sucesso!", type: newType });
  } catch (error) {
    console.error("Erro ao criar tipo de empresa:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Atualizar informações de um tipo de empresa
router.put("/types/:id", checkToken, async (req, res) => {
  const { name, description, totalAnswers } = req.body;

  try {
    const updatedType = await Type.findByIdAndUpdate(
      req.params.id,
      { name, description, totalAnswers },
      { new: true }
    );

    if (!updatedType) {
      return res.status(404).json({ msg: "Tipo de empresa não encontrado" });
    }

    res
      .status(200)
      .json({
        msg: "Tipo de empresa atualizado com sucesso!",
        type: updatedType,
      });
  } catch (error) {
    console.error("Erro ao atualizar tipo de empresa:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Excluir um tipo de empresa
router.delete("/types/:id", checkToken, async (req, res) => {
  try {
    const deletedType = await Type.findByIdAndDelete(req.params.id);

    if (!deletedType) {
      return res.status(404).json({ msg: "Tipo de empresa não encontrado" });
    }

    res.status(200).json({ msg: "Tipo de empresa excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir tipo de empresa:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Obter informações de um tipo de empresa pelo _id
router.get("/types/:id", checkToken, async (req, res) => {
  try {
    const typeId = req.params.id;

    const type = await Type.findById(typeId);

    if (!type) {
      return res.status(404).json({ msg: "Tipo de empresa não encontrado" });
    }

    res.status(200).json({ type });
  } catch (error) {
    console.error("Erro ao obter tipo de empresa:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

module.exports = router;
