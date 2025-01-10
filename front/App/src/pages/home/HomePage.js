import React, { useState, useEffect } from "react";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { Link, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const HomePage = () => {
  const location = useLocation();
  const [userName, setUserName] = useState("");
  const [anchorElAdmin, setAnchorElAdmin] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElForm, setAnchorElForm] = useState(null);
  const [anchorElDiag, setAnchorElDiag] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleAdminClick = (event) => {
    setAnchorElAdmin(event.currentTarget);
  };

  const handleFormClick = (event) => {
    setAnchorElForm(event.currentTarget);
  };

  const handleUserClick = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleDiagClick = (event) => {
    setAnchorElDiag(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorElAdmin(null);
    setAnchorElUser(null);
    setAnchorElForm(null);
    setAnchorElDiag(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decoded = jwtDecode(token);
      const userId = decoded.id;
      setIsAdmin(decoded.isAdmin);

      axios
        .get(`http://localhost:3000/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUserName(response.data.user.name);
        })
        .catch((error) => {
          console.error("Erro ao buscar usuário:", error);
        });
    }

    if (!token) {
      window.location.href = "/";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        margin: "2rem",
        padding: "1rem 2rem 1rem 2rem",
        fontFamily: "Montserrat, sans-serif",
      }}
    >
      {isAdmin && (
        <Box display="flex" alignItems="center" gap={20} sx={{ flex: 1 }}>
          {/* LOGO DA EMPRESA */}
          <img
            src="/LOGO SEM FUNDO FONTE LARANJA.png"
            alt="Logo da Empresa"
            style={{ height: "50px", width: "auto", marginRight: "30px" }}
          />

          {/* Menu Admin */}
          <div>
            <Typography
              variant="body1"
              onClick={handleAdminClick}
              sx={{
                color:
                  location.pathname === "/empresa"
                    ? "blue"
                    : location.pathname === "/perguntas"
                    ? "blue"
                    : location.pathname === "/segmento"
                    ? "blue"
                    : location.pathname === "/type"
                    ? "blue"
                    : location.pathname === "/usuario"
                    ? "blue"
                    : "black",
              }}
            >
              Admin
            </Typography>
            <Menu
              anchorEl={anchorElAdmin}
              open={Boolean(anchorElAdmin)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              getContentAnchorEl={null}
              PaperProps={{
                sx: {
                  boxShadow: "1px 3px 4px 2px rgba(0, 0, 0, 0.1)",
                  marginTop: "2.5rem",
                  padding: "1rem 1rem 1rem 1rem",
                },
              }}
              sx={{
                position: "absolute",
                left: "3rem",
              }}
            >
              <Link
                to="/empresa"
                style={{
                  textDecoration: "none",
                  color: location.pathname === "/empresa" ? "blue" : "black",
                }}
              >
                <MenuItem onClick={handleClose}>Empresas</MenuItem>
              </Link>
              <Link
                to="/perguntas"
                style={{
                  textDecoration: "none",
                  color: location.pathname === "/perguntas" ? "blue" : "black",
                }}
              >
                <MenuItem onClick={handleClose}>Perguntas</MenuItem>
              </Link>
              <Link
                to="/segmento"
                style={{
                  textDecoration: "none",
                  color: location.pathname === "/segmento" ? "blue" : "black",
                }}
              >
                <MenuItem onClick={handleClose}>Segmentos</MenuItem>
              </Link>
              <Link
                to="/type"
                style={{
                  textDecoration: "none",
                  color: location.pathname === "/type" ? "blue" : "black",
                }}
              >
                <MenuItem onClick={handleClose}>Tipos</MenuItem>
              </Link>
              <Link
                to="/usuario"
                style={{
                  textDecoration: "none",
                  color: location.pathname === "/usuario" ? "blue" : "black",
                }}
              >
                <MenuItem onClick={handleClose}>Usuários</MenuItem>
              </Link>
            </Menu>
          </div>

          {/* Menu Formulários */}
          <Box>
            <Typography
              variant="body1"
              onClick={handleFormClick}
              style={{
                fontSize: "1rem",
                margin: 0,
                cursor: "pointer",
                fontFamily: ", sans-serif",
              }}
              sx={{
                color:
                  location.pathname === "/form"
                    ? "blue"
                    : location.pathname === "/formularios"
                    ? "blue"
                    : "black",
              }}
            >
              Formulários
            </Typography>
            <Menu
              anchorEl={anchorElForm}
              open={Boolean(anchorElForm)}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              getContentAnchorEl={null}
              PaperProps={{
                sx: {
                  boxShadow: "1px 3px 4px 2px rgba(0, 0, 0, 0.1)",
                  marginTop: "2.5rem",
                  padding: "1rem 1rem 1rem 1rem",
                },
              }}
              sx={{
                position: "absolute",
                left: "3.5rem",
              }}
            >
              <Link
                to="/form"
                style={{
                  fontSize: "1rem",
                  margin: 0,
                  fontFamily: "Montserrat, sans-serif",
                  textDecoration: "none",
                  color: location.pathname === "/form" ? "blue" : "black",
                }}
              >
                <MenuItem onClick={handleClose}>Novo Formulário</MenuItem>
              </Link>
              <Link
                to="/formularios"
                style={{
                  textDecoration: "none",
                  color:
                    location.pathname === "/formularios" ? "blue" : "black",
                }}
              >
                <MenuItem onClick={handleClose}>Meus Formulários</MenuItem>
              </Link>
            </Menu>
          </Box>

          {/* Menu Diagnóstico */}
          <Typography
            variant="body1"
            onClick={handleDiagClick}
            style={{
              fontSize: "1rem",
              margin: 0,
              cursor: "pointer",
              fontFamily: ", sans-serif",
              color:
                location.pathname === "/diagnostico/criar"
                  ? "blue"
                  : location.pathname === "/diagnostico/todos"
                  ? "blue"
                  : "black",
            }}
          >
            Diagnóstico
          </Typography>
          <Menu
            anchorEl={anchorElDiag}
            open={Boolean(anchorElDiag)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            getContentAnchorEl={null}
            PaperProps={{
              sx: {
                boxShadow: "1px 3px 4px 2px rgba(0, 0, 0, 0.1)",
                marginTop: "2.5rem",
                padding: "1rem 1rem 1rem 1rem",
              },
            }}
            sx={{
              position: "absolute",
              left: "3.5rem",
            }}
          >
            <Link
              to="/diagnostico/criar"
              style={{
                fontSize: "1rem",
                margin: 0,
                fontFamily: "Montserrat, sans-serif",
                textDecoration: "none",
                color:
                  location.pathname === "/diagnostico/criar" ? "blue" : "black",
              }}
            >
              <MenuItem onClick={handleClose}>Novo Diagnóstico</MenuItem>
            </Link>
            <Link
              to="/diagnostico/todos"
              style={{
                textDecoration: "none",
                color:
                  location.pathname === "/diagnostico/todos" ? "blue" : "black",
              }}
            >
              <MenuItem onClick={handleClose}>Meus Diagnósticos</MenuItem>
            </Link>
          </Menu>

          {/* Menu Dashboards */}
          <Link
            to="/dashboards"
            style={{
              textDecoration: "none",
              color: location.pathname === "/dashboards" ? "blue" : "black",
            }}
          >
            <MenuItem>Dashboards</MenuItem>
          </Link>
        </Box>
      )}

      {/* Menu de Usuário */}
      <Box>
        <Typography
          variant="body1"
          onClick={handleUserClick}
          style={{
            fontSize: "1rem",
            margin: 0,
            cursor: "pointer",
            fontFamily: ", sans-serif",
            color: location.pathname === "/perfil" ? "blue" : "black",
          }}
        >
          {userName || "Usuário"}
        </Typography>
        <Menu
          anchorEl={anchorElUser}
          open={Boolean(anchorElUser)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          getContentAnchorEl={null}
          PaperProps={{
            sx: {
              boxShadow: "1px 3px 4px 2px rgba(0, 0, 0, 0.1)",
              marginTop: "2.5rem",
              padding: "1rem 1rem 1rem 1rem",
            },
          }}
          sx={{
            position: "absolute",
            left: "2rem",
          }}
        >
          <MenuItem onClick={handleClose}>
            <Link
              to="/perfil"
              style={{
                textDecoration: "none",
                color: location.pathname === "/perfil" ? "blue" : "black",
              }}
            >
              Perfil
            </Link>
          </MenuItem>
          <MenuItem onClick={handleLogout}>Sair ➔</MenuItem>
        </Menu>
      </Box>
    </Paper>
  );
};

export default HomePage;
