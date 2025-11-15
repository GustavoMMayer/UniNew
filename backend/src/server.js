require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');

const authRoutes = require('./routes/auth.routes');
const usuariosRoutes = require('./routes/usuarios.routes');
const alunosRoutes = require('./routes/alunos.routes');
const docentesRoutes = require('./routes/docentes.routes');
const fornecedoresRoutes = require('./routes/fornecedores.routes');
const cursosRoutes = require('./routes/cursos.routes');
const disciplinasRoutes = require('./routes/disciplinas.routes');
const notasRoutes = require('./routes/notas.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/alunos', alunosRoutes);
app.use('/api/docentes', docentesRoutes);
app.use('/api/fornecedores', fornecedoresRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/disciplinas', disciplinasRoutes);
app.use('/api/notas', notasRoutes);

app.get('/api', (req, res) => {
  res.json({
    message: 'API UniNew está funcionando!',
    version: '1.0.0',
    endpoints: [
      '/api/auth',
      '/api/usuarios',
      '/api/alunos',
      '/api/docentes',
      '/api/fornecedores',
      '/api/cursos',
      '/api/disciplinas',
      '/api/notas'
    ]
  });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint não encontrado' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Erro interno do servidor' });
});

const startServer = async () => {
  try {
    await testConnection();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📡 API disponível em http://localhost:${PORT}/api`);
      console.log(`🐳 Rodando em modo: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

startServer();
