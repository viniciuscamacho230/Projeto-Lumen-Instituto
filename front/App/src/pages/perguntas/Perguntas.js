import React, { useState, useEffect } from "react";
import HomePage from "../home/HomePage";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  TextField,
  Button,
  Box,
  MenuItem,
  Grid,
} from "@mui/material";

const Perguntas = () => {
  const [perguntas, setPerguntas] = useState([]);
  const [formData, setFormData] = useState({
    texto_pergunta: "",
    tipo: "",
    opcoes_resposta: [{ resposta: "", pontos: "" }],
  });
  const [openModal, setOpenModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editPergunta, setEditPergunta] = useState(null);
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setIsAdmin(decoded.isAdmin);
    }
    fetchPerguntas();
    fetchTipos();
  }, []);

  const fetchTipos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/types", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTipos(response.data.types);
    } catch (error) {
      console.error("Error fetching types:", error);
    }
  };

  const fetchPerguntas = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/perguntas", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPerguntas(response.data.perguntas);
    } catch (error) {
      console.error("Error fetching perguntas:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const adicionarOpcao = () => {
    setFormData({
      ...formData,
      opcoes_resposta: [
        ...formData.opcoes_resposta,
        { resposta: "", pontos: "" },
      ],
    });
  };

  const removerOpcao = (index) => {
    const novasOpcoes = formData.opcoes_resposta.filter((_, i) => i !== index);
    setFormData({ ...formData, opcoes_resposta: novasOpcoes });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/perguntas",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchPerguntas();
      setOpenModal(false);
      setFormData({
        texto_pergunta: "",
        tipo: "",
        opcoes_resposta: [{ resposta: "", pontos: "" }],
      });
    } catch (error) {
      console.error("Error creating pergunta:", error);
    }
  };

  const handleEdit = (pergunta) => {
    setEditPergunta(pergunta);
    setFormData({
      texto_pergunta: pergunta.texto_pergunta,
      tipo: pergunta.tipo,
      opcoes_resposta: pergunta.opcoes_resposta,
    });
    setOpenModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!editPergunta || !editPergunta._id) {
      console.error("Pergunta para edição não está corretamente definida.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:3000/perguntas/${editPergunta._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      fetchPerguntas();
      setOpenModal(false);
      setEditPergunta(null);
      setFormData({
        texto_pergunta: "",
        tipo: "",
        opcoes_resposta: [{ resposta: "", pontos: "" }],
      });
    } catch (error) {
      console.error("Error updating pergunta:", error);
    }
  };

  const handleDelete = async (perguntaId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/perguntas/${perguntaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPerguntas();
    } catch (error) {
      console.error("Error deleting pergunta:", error);
    }
  };

  const openCreateModal = () => {
    setOpenModal(true);
  };

  const closeCreateModal = () => {
    setOpenModal(false);
    setFormData({
      texto_pergunta: "",
      tipo: "",
      opcoes_resposta: [{ resposta: "", pontos: "" }],
    });
    setEditPergunta(null);
  };

  return (
    <div>
      <HomePage />
      {isAdmin && (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: "xl",
            p: 5,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            margin: "1rem 2rem 1rem 2rem",
            gap: "2rem",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              gap: "1rem",
            }}
          >
            <TextField
              type="search"
              label="Pesquisar por Nome"
              name="search"
              sx={{ width: "80%" }}
            />
            <Button
              variant="contained"
              onClick={openCreateModal}
              sx={{ width: "auto", height: "auto" }}
            >
              Criar nova pergunta
            </Button>
          </Box>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Pergunta</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {perguntas.map((pergunta) => (
                  <TableRow key={pergunta._id}>
                    <TableCell>{pergunta.texto_pergunta}</TableCell>
                    <TableCell
                      sx={{
                        display: "flex",
                        gap: "1rem",
                      }}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleEdit(pergunta)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() => handleDelete(pergunta._id)}
                      >
                        Excluir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Modal pergunta */}
          <Modal
            open={openModal}
            onClose={closeCreateModal}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              overflow: "auto",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "70%",
                maxWidth: "700px",
                backgroundColor: "white",
                borderRadius: "xl",
                p: 5,
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                margin: "1rem 2rem 1rem 2rem",
              }}
            >
              <form
                onSubmit={editPergunta ? handleUpdateSubmit : handleFormSubmit}
              >
                <Grid container spacing={2} sx={{ mb: "1rem", width: "100%" }}>
                  {/* Campo "Insira sua pergunta" com ajuste automático de altura */}
                  <Grid item xs={12}>
                    <TextField
                      label="Insira sua pergunta"
                      variant="standard"
                      fullWidth
                      name="texto_pergunta"
                      value={formData.texto_pergunta}
                      onChange={handleInputChange}
                      sx={{ width: "100%" }}
                      multiline
                      maxRows={10}
                    />
                  </Grid>

                  {/* Campo "Selecione o Tipo" com largura menor */}
                  <Grid item xs={12} sm={4}>
                    <TextField
                      select
                      label="Selecione o Tipo"
                      variant="standard"
                      fullWidth
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleInputChange}
                    >
                      {tipos.map((tipo) => (
                        <MenuItem key={tipo._id} value={tipo._id}>
                          {tipo.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>

                {formData.opcoes_resposta.map((opcao, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                      mb: "1rem",
                    }}
                  >
                    <TextField
                      name={`resposta${index}`}
                      value={opcao.resposta}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          opcoes_resposta: formData.opcoes_resposta.map(
                            (res, i) =>
                              i === index
                                ? { ...res, resposta: e.target.value }
                                : res
                          ),
                        })
                      }
                      label="Insira uma opção de resposta"
                      variant="standard"
                      sx={{ width: "60%" }}
                      multiline
                      maxRows={5}
                    />
                    <TextField
                      type="number"
                      placeholder="Pontos"
                      name={`pontos${index}`}
                      value={opcao.pontos}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          opcoes_resposta: formData.opcoes_resposta.map(
                            (res, i) =>
                              i === index
                                ? { ...res, pontos: e.target.value }
                                : res
                          ),
                        })
                      }
                      label="Pontos"
                      variant="standard"
                      sx={{ width: "20%" }}
                    />
                    <Button
                      color="error"
                      onClick={() => removerOpcao(index)}
                      sx={{ width: "20%", mt: 1, height: "100%" }}
                    >
                      Remover
                    </Button>
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  color="success"
                  onClick={adicionarOpcao}
                  sx={{ width: "100%" }}
                >
                  Adicionar Opção
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{ width: "100%", mt: 2 }}
                >
                  {editPergunta ? "Atualizar Pergunta" : "Adicionar Pergunta"}
                </Button>
              </form>
            </Box>
          </Modal>
        </Box>
      )}
    </div>
  );
};

export default Perguntas;
