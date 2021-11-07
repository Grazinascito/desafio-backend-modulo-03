const yup = require('./config');

const schemaCadastroUsuario = yup.object().shape({
    nome: yup.string().required("O campo nome é obrigatório yup"),
    email: yup.string().email().required("O campo email é obrigatório yup"),
    senha: yup.string().required("O campo senha é obrigatório yup").min(6).max(10),
    nome_loja: yup.string().required("O campo nome_loja é obrigatório yup")
  });

  module.exports = schemaCadastroUsuario;


