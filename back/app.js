require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Rotas
const userRoutes = require("./routes/userRoutes");
const typeRoutes = require("./routes/typeRoutes");
const segmentoRoutes = require("./routes/segmentoRoutes");
const empresaRoutes = require("./routes/empresaRoutes");
const perguntaRoutes = require("./routes/perguntaRoutes");
const formulario = require("./routes/formulario");
const Resposta = require("./routes/respostaFormulario");
const Diagnostico = require("./routes/diagnosticos");
const PDF = require("./routes/pdf");

// Rotas PDF
app.get("/gerar-pdf/:formularioId/:respostaId", PDF);
app.get("/gerar-pdf/:formularioId/:empresaId/:diagnosticoId", PDF);
app.get("/gerar-pdf/diagnostico/:diagnosticoId/:empresaId", PDF);

// Rotas Usuarios
app.get("/user/:id", userRoutes);
app.get("/users", userRoutes);
app.post("/users", userRoutes);
app.post("/auth/login", userRoutes);
app.put("/users/:id", userRoutes);
app.put("/user/:id/change-password", userRoutes);
app.delete("/users/:id", userRoutes);

// Rotas DiagnÃ³sticos
app.get("/todos", Diagnostico);
app.post("/criar", Diagnostico);
app.post("/criarDiagnosticoEmpresa", Diagnostico);
app.get("/diagnostico/:diagnosticoId", Diagnostico);
app.delete("/diagnostico/:diagnosticoId", Diagnostico);

// Rotas Tipos
app.get("/types", typeRoutes);
app.post("/types", typeRoutes);
app.put("/types/:id", typeRoutes);
app.delete("/types/:id", typeRoutes);
app.get("/types/:id", typeRoutes);

// Rotas formulario
app.get("/formularios", formulario);
app.get("/formularios/usuario/:userId", formulario);
app.get("/formularios/:id", formulario);
app.post("/formularios", formulario);
app.put("/formularios/:id", formulario);
app.delete("/formularios/:id", formulario);

// Rotas Respostas
app.post("/respostas", Resposta);
app.get("/respostas/:formularioId", Resposta);
app.get("/respostas/formulario/:formularioId", Resposta);
app.get("/respostas/formulario/:formularioId/:respostaId", Resposta);
app.get("/respostas/empresa/:empresaId/formulario/:formularioId", Resposta);
app.get(
  "/respostas/empresa/:empresaId/formulario/:formularioId/diagnostico/:diagnosticoId",
  Resposta
);
app.post("/respostasdiagnostico", Resposta);

// Rotas Segmentos
app.get("/segmentos", segmentoRoutes);
app.post("/segmentos", segmentoRoutes);
app.put("/segmentos/:id", segmentoRoutes);
app.delete("/segmentos/:id", segmentoRoutes);

// Rotas Empresas
app.get("/empresas", empresaRoutes);
app.post("/empresas", empresaRoutes);
app.put("/empresas/:id", empresaRoutes);
app.delete("/empresas/:id", empresaRoutes);

// Rotas Perguntas
app.get("/perguntas", perguntaRoutes);
app.get("/perguntas/:tipo", perguntaRoutes);
app.post("/perguntas", perguntaRoutes);
app.put("/perguntas/:id", perguntaRoutes);
app.delete("/perguntas/:id", perguntaRoutes);

// Credencials
// const dbUser = process.env.DB_USER
// const dbPassword = process.env.DB_PASS

mongoose
  .connect(
    `mongodb+srv://viniciuscamacho01:ItynniLVFhLNH3O5@cluster2024.m6wbd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster2024`
  )
  .then(() => {
    app.listen(3000);
    console.log("Conectou ao banco!");
  })
  .catch((err) => console.log(err));
