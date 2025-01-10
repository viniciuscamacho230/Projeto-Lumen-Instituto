const mongoose = require("mongoose");

const User = mongoose.model("User", {
  name: String,
  lastname: String,
  cpf: String,
  email: String,
  civil: String,
  date: String,
  password: String,
  dono: Boolean,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Empresa",
    required: false,
  },
});

module.exports = User;
