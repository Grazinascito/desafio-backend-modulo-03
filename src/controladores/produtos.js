const conexao = require("../conexao");
const schemaCadastroProduto = require("../validacoes/schemaCadastroProduto");
const schemaAtualizarProduto = require("../validacoes/schemaAtualizarProduto");

const listarProdutos = async (req, res) => {
  const { usuario } = req;
  
  
  try {
      const produtos = await conexao.query(
          "select * from produtos where usuario_id = $1",
          [usuario.id]
        );
      return res.status(200).json(produtos.rows);

  }catch(error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const obterProduto = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;

  try {
    const produtos = await conexao.query(
      "select * from produtos where id = $1 is not null and usuario_id = $2",
      [id, usuario.id]
    );

    if (produtos.rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: `Não existe produto cadastrado com o id ${id}` });
    }

    return res.status(200).json(produtos.rows[0]);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const cadastrarProduto = async (req, res) => {
  const { categoria, imagem } = req.body;
  const { usuario } = req;

  try {

    await schemaCadastroProduto.validate(req.body);
    const queryCadastro =
      "insert into produtos(nome, usuario_id, quantidade,categoria,preco,descricao,imagem) values ($1, $2, $3, $4, $5, $6, $7)";

    const produtoCadastrado = await conexao.query(queryCadastro, [
      nome,
      usuario.id,
      quantidade,
      categoria,
      preco,
      descricao,
      imagem,
    ]);

    if (produtoCadastrado.rowCount === 0) {
      return res.status(404).json({ mensagem: "Produto não cadastrado" });
    }

    return res.status(200).json({
      mensagem: "Produto cadastrado com sucesso.",
    });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const atualizarProduto = async (req, res) => {
  const { id } = req.params;
  const { categoria, imagem } = req.body;
  const { usuario } = req;

  

  try {

    await schemaAtualizarProduto.validate(req.body);
    const verificaDados = await conexao.query(
      "select * from produtos where id = $1 and usuario_id = $2",
      [id, usuario.id]
    );

    if (verificaDados.rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: "Usuario ou Produto não existe" });
    }

    const queryAtualiza =
      "update produtos set nome = $1, quantidade = $2, categoria = $3, preco = $4, descricao = $5, imagem = $6 where id = $7 and usuario_id = $8";

    const verificaAtualizacao = await conexao.query(queryAtualiza, [
      nome,
      quantidade,
      categoria,
      preco,
      descricao,
      imagem,
      id,
      usuario.id,
    ]);

    if (verificaAtualizacao.rowCount === 0) {
      return res.status(400).json({ mensagem: "Produto não atualizado" });
    }

    return res.status(200).json({ mensagem: "Produto atualizado com sucesso" });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const deletarProduto = async (req, res) => {
  const { id } = req.params;
  const { usuario } = req;

  try {
    const verificaDados = await conexao.query(
      "select * from produtos where id = $1 and usuario_id = $2",
      [id, usuario.id]
    );

    if (verificaDados.rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: `Usuario ou Produto inexistente para o id ${id}` });
    }

    const queryDelete = "delete from produtos where id = $1";

    const deletandoProduto = await conexao.query(queryDelete, [id]);

    if (deletandoProduto.rowCount === 0) {
      return res
        .status(404)
        .json({ mensagem: "Não foi possivel excluir o produto" });
    }

    return res.status(200).json({ mensagem: "Produto excluido com sucesso" });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = {
  listarProdutos,
  obterProduto,
  cadastrarProduto,
  atualizarProduto,
  deletarProduto,
};
