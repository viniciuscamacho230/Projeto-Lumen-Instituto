const express = require("express");
const router = express.Router();
const User = require("../models/User");
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

// Rota para obter um usuário por ID
router.get("/user/:id", checkToken, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Rota pública - Bem-vindo
router.get("/", (req, res) => {
  res.status(200).json({ msg: "Bem-vindo" });
});

// Rota privada
router.get("/users/:id", checkToken, async (req, res) => {
  const id = req.params.id;
  try {
    const user = await User.findById(id, "-password");
    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error("Erro ao buscar usuário por ID:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Rota de login
router.post("/auth/login", async (req, res) => {
  const { name, password } = req.body;
  // Validação
  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatório!" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatória!" });
  }

  try {
    const user = await User.findOne({ name: name });
    if (!user) {
      return res.status(422).json({ msg: "Usuário inválido" });
    }
    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(422).json({ msg: "Senha inválida!" });
    }

    const secret = "minhaChaveSecreta123!";
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      secret
    );

    res.status(200).json({ msg: "Autenticação realizada com sucesso", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Listar todos os usuários
router.get("/users", checkToken, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.status(200).json({ users });
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Criar um novo usuário
router.post("/users", checkToken, async (req, res) => {
  const { name, lastname, cpf, civil, date, email, password, empresa, dono } =
    req.body;

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    lastname,
    cpf,
    civil,
    date,
    email,
    password: passwordHash,
    empresa,
    dono,
  });

  try {
    await newUser.save();
    res.status(201).json({ msg: "Usuário criado com sucesso!", user: newUser });
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Atualizar informações de um usuário
router.put("/users/:id", checkToken, async (req, res) => {
  const { name, lastname, cpf, civil, date, email, empresa } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, lastname, cpf, civil, date, email, empresa },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    res
      .status(200)
      .json({ msg: "Usuário atualizado com sucesso!", user: updatedUser });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Excluir um usuário
router.delete("/users/:id", checkToken, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    res.status(200).json({ msg: "Usuário excluído com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

// Alterar senha de um usuário
router.put("/user/:id/change-password", checkToken, async (req, res) => {
  const userId = req.params.id;
  const { newPassword } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ msg: "Usuário não encontrado" });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    user.password = passwordHash;
    await user.save();

    res.status(200).json({ msg: "Senha alterada com sucesso!" });
  } catch (error) {
    console.error("Erro ao alterar senha:", error);
    res.status(500).json({ msg: "Erro no servidor" });
  }
});

module.exports = router;
