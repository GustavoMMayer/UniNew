module.exports = {
  ...require('./auth.validator'),
  ...require('./usuario.validator'),
  ...require('./aluno.validator'),
  ...require('./docente.validator'),
  ...require('./fornecedor.validator'),
  ...require('./curso.validator'),
  ...require('./disciplina.validator'),
  ...require('./nota.validator')
};
