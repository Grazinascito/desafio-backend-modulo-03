const yup = require("./config");

const schemaLoginUsuario = yup.object().shape({
  email: yup.string().email().required("Email ou senha invalidos"),
  senha: yup
    .string()
    .required("Email ou senha invalidos")
});

module.exports = schemaLoginUsuario;
