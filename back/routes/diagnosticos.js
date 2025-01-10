const express = require("express");
const router = express.Router();
const Diagnostico = require("../models/Diagnostico");

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
// Rota para criar um novo diagnóstico
router.post("/criar", checkToken, async (req, res) => {
  try {
    const { nome, formularios } = req.body;
    const novoDiagnostico = new Diagnostico({ nome, formularios });
    const diagnosticoSalvo = await novoDiagnostico.save();
    res.json(diagnosticoSalvo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter todos os diagnósticos
router.get("/todos", checkToken, async (req, res) => {
  try {
    const diagnoscticos = await Diagnostico.find();
    res.json(diagnoscticos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para obter detalhes de um diagnóstico específico
router.get("/diagnostico/:diagnosticoId", checkToken, async (req, res) => {
  try {
    const diagnostico = await Diagnostico.findById(
      req.params.diagnosticoId
    ).populate("formularios");

    if (!diagnostico) {
      return res.status(404).json({ msg: "Diagnóstico não encontrado" });
    }

    res.json(diagnostico);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para excluir um diagnóstico específico
router.delete("/diagnostico/:diagnosticoId", checkToken, async (req, res) => {
  try {
    const diagnostico = await Diagnostico.findByIdAndDelete(
      req.params.diagnosticoId
    );

    if (!diagnostico) {
      return res.status(404).json({ msg: "Diagnóstico não encontrado" });
    }

    res.json({ msg: "Diagnóstico excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para criar um novo diagnóstico com empresa
router.post("/criarDiagnosticoEmpresa", checkToken, async (req, res) => {
  try {
    const { nome, formularios, empresa } = req.body;

    if (empresa && !mongoose.Types.ObjectId.isValid(empresa)) {
      return res.status(400).json({ message: "ID da empresa inválido" });
    }

    const novoDiagnostico = new Diagnostico({ nome, formularios, empresa });
    const diagnosticoSalvo = await novoDiagnostico.save();

    res.json(diagnosticoSalvo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
