const express = require("express");
const router = express.Router();
const Empresa = require("../models/Empresa");
const Segmento = require("../models/Segmento");
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

router.post("/empresas", checkToken, async (req, res) => {
  const { nome, logo, cnpj, nomeDono, descricao, segmento } = req.body;

  const novaEmpresa = new Empresa({
    nome,
    logo,
    cnpj,
    nomeDono,
    descricao,
    segmento,
  });

  try {
    const existentSegment = await Segmento.findById(segmento);
    if (!existentSegment) {
      return res.status(400).json({ msg: "Segmento não encontrado" });
    }

    await novaEmpresa.save();
    res
      .status(201)
      .json({ msg: "Empresa criada com sucesso!", empresa: novaEmpresa });
  } catch (error) {
    console.error("Erro ao criar empresa:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

router.get("/empresas", checkToken, async (req, res) => {
  try {
    const empresas = await Empresa.find({}).populate("segmento");
    res.status(200).json({ empresas });
  } catch (error) {
    console.error("Erro ao buscar empresas:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

router.put("/empresas/:id", checkToken, async (req, res) => {
  const { nome, logo, cnpj, nomeDono, descricao, segmento } = req.body;

  try {
    const empresaAtualizada = await Empresa.findByIdAndUpdate(
      req.params.id,
      { nome, logo, cnpj, nomeDono, descricao, segmento },
      { new: true }
    ).populate("segmento");

    if (!empresaAtualizada) {
      return res.status(404).json({ msg: "Empresa não encontrada" });
    }

    res
      .status(200)
      .json({
        msg: "Empresa atualizada com sucesso!",
        empresa: empresaAtualizada,
      });
  } catch (error) {
    console.error("Erro ao atualizar empresa:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

router.delete("/empresas/:id", checkToken, async (req, res) => {
  try {
    const empresaExcluida = await Empresa.findByIdAndDelete(req.params.id);

    if (!empresaExcluida) {
      return res.status(404).json({ msg: "Empresa não encontrada" });
    }

    res.status(200).json({ msg: "Empresa excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir empresa:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

module.exports = router;
