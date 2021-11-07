const conexao = require("../conexao");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_secret = require("./jwt_secret");
const schemaCadastroUsuario = require("../validacoes/schemaCadastroUsuario");
const schemaLoginUsuario = require("../validacoes/schemaLoginUsuario");
const schemaAtualizarUsuario = require("../validacoes/schemaAtualizarUsuario");

const infoUsuario = async (req, res) => {
  const { id } = req.usuario;

  try {
    const infoUsuario = await conexao.query(
      "select * from usuarios where id = $1",
      [id]
    );

    if (!infoUsuario) {
      return res.status(401).json({ mensagem: "Usuario não autorizado" });
    }

    return res.status(200).json(req.usuario);
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const cadastroUsuario = async (req, res) => {
  try {
    await schemaCadastroUsuario.validate(req.body);

    const queryExistenciaDoEmail = "select * from usuarios where email = $1";
    const emailExiste = await conexao.query(queryExistenciaDoEmail, [email]);

    if (emailExiste.rowCount > 0) {
      return res.status(400).json({
        mensagem: "Já existe usuário cadastrado com o e-mail informado.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const query =
      "insert into usuarios(nome, email, senha, nome_loja) values ($1, $2, $3, $4)";

    const usuarioRegistrado = await conexao.query(query, [
      nome,
      email,
      senhaCriptografada,
      nome_loja,
    ]);

    if (usuarioRegistrado.rowCount === 0) {
      return res.status(500).json({ mensagem: "Usuario não cadastrado." });
    }

    return res.status(201).json({ mensagem: "Usuario cadastrado com sucesso" });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const loginUsuario = async (req, res) => {
  try {
    await schemaLoginUsuario.validate(req.body);

    const queryVericandoEmail = "select * from usuarios where email = $1";
    const { rows, rowCount } = await conexao.query(queryVericandoEmail, [
      email,
    ]);

    if (rowCount === 0) {
      return res.status(404).json({ mensagem: "Email inválido" });
    }

    const usuario = rows[0];

    const verificandoSenha = await bcrypt.compare(senha, usuario.senha);

    if (!verificandoSenha) {
      return res.status(400).json({
        mensagem: "Usuário e/ou senha está incorreta.",
      });
    }
    const token = jwt.sign({ id: usuario.id }, jwt_secret, { expiresIn: "1d" });

    return res.status(200).json({
      token,
    });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

const atualizarUsuario = async (req, res) => {
  
  const { id } = req.usuario;

  try {
    await schemaAtualizarUsuario.validate(req.body);
    const infoUsuario = await conexao.query(
      "select * from usuarios where id = $1",
      [id]
    );

    if (!infoUsuario) {
      return res.status(401).json({ "mensagem: ": "Usuario não autorizado" });
    }

    const queryEmail = "select * from usuarios where email = $1";
    const existenciaDoEmail = await conexao.query(queryEmail, [email]);

    if (existenciaDoEmail.rowCount > 0) {
      return res.status(400).json({
        mensagem:
          "O e-mail informado já está sendo utilizado por outro usuário.",
      });
    }

    const senhaCriptografada = await bcrypt.hash(senha, 10);

    const queryAtualizar =
      "update usuarios set nome = $1, email = $2, senha = $3, nome_loja = $4 where id = $5 RETURNING *";
    const usuarioAtualizado = await conexao.query(queryAtualizar, [
      nome,
      email,
      senhaCriptografada,
      nome_loja,
      id,
    ]);

    if (usuarioAtualizado.rowCount === 0) {
      return res.status(400).json({
        mensagem: "Usuario não foi atualizado.",
      });
    }
    return res.status(200).json({
      mensagem: "Usuario Atualizado.",
    });
  } catch (error) {
    return res.status(400).json({ mensagem: error.message });
  }
};

module.exports = {
  cadastroUsuario,
  loginUsuario,
  infoUsuario,
  atualizarUsuario,
};
