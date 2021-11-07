const yup = require('./config');

const schemaAtualizarProduto = yup.object().shape({
    nome: yup.string().required("O nome do produto deve ser informado"),
    quantidade: yup.number().required("A quantidade deve ser informada"),
    descricao: yup.string().required("A descrição deve ser informada"),
    preco: yup.string().required("O campo preco é obrigatório yup")
  });

  module.exports = schemaAtualizarProduto;

