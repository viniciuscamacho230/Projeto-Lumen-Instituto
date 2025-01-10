const express = require("express");
const puppeteer = require("puppeteer");
const router = express.Router();
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

router.get(
  "/gerar-pdf/:formularioId/:respostaId",
  checkToken,
  async (req, res) => {
    const { formularioId, respostaId } = req.params;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      `http://localhost:3001/respostas/PDF/detalhes/${formularioId}/${respostaId}`,
      { waitUntil: "networkidle0" }
    );
    const pdf = await page.pdf({ format: "A4" });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length,
    });
    res.send(pdf);
  }
);

router.get(
  "/gerar-pdf/:formularioId/:empresaId/:diagnosticoId",
  checkToken,
  async (req, res) => {
    const { formularioId, empresaId, diagnosticoId } = req.params;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      `http://localhost:3001/respostas/PDF/detalhes/${formularioId}/${empresaId}/${diagnosticoId}`,
      { waitUntil: "networkidle0" }
    );
    const pdf = await page.pdf({ format: "A4" });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length,
    });
    res.send(pdf);
  }
);

router.get(
  "/gerar-pdf/diagnostico/:diagnosticoId/:empresaId",
  checkToken,
  async (req, res) => {
    const { diagnosticoId, empresaId } = req.params;

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(
      `http://localhost:3001/respostas/PDF/${diagnosticoId}/${empresaId}`,
      { waitUntil: "networkidle0" }
    );
    const pdf = await page.pdf({ format: "A4" });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Length": pdf.length,
    });
    res.send(pdf);
  }
);
module.exports = router;
