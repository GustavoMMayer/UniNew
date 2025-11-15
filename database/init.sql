-- Criação do banco de dados (já é criado pelo docker-compose, mas garantindo)
CREATE DATABASE IF NOT EXISTS uninew_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE uninew_db;

-- Garantir que a conexão use UTF-8
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection=utf8mb4;

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS usuarios (
  cpf VARCHAR(11) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  telefone VARCHAR(20),
  senha VARCHAR(255) NOT NULL,
  tipo_conta ENUM('aluno', 'docente', 'funcionario', 'gerente') NOT NULL,
  tipo_conta_id TINYINT NOT NULL,
  curso VARCHAR(100),
  situacao ENUM('Ativo', 'Inativo'),
  grau_academico VARCHAR(100),
  disciplina VARCHAR(255),
  carga_horaria INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (
    (tipo_conta = 'aluno' AND tipo_conta_id = 1) OR
    (tipo_conta = 'docente' AND tipo_conta_id = 2) OR
    (tipo_conta = 'funcionario' AND tipo_conta_id = 3) OR
    (tipo_conta = 'gerente' AND tipo_conta_id = 4)
  )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de fornecedores
CREATE TABLE IF NOT EXISTS fornecedores (
  cnpj VARCHAR(14) PRIMARY KEY,
  razao_social VARCHAR(255) NOT NULL,
  contatos JSON NOT NULL,
  servicos JSON NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de cursos
CREATE TABLE IF NOT EXISTS cursos (
  codigo VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(255) UNIQUE NOT NULL,
  disciplinas JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de disciplinas
CREATE TABLE IF NOT EXISTS disciplinas (
  codigo VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(255) UNIQUE NOT NULL,
  carga_horaria INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de notas
CREATE TABLE IF NOT EXISTS notas (
  id VARCHAR(100) PRIMARY KEY,
  cpf VARCHAR(11) NOT NULL,
  disciplina VARCHAR(255) NOT NULL,
  disciplina_codigo VARCHAR(50) NOT NULL,
  nota DECIMAL(4,2) NOT NULL CHECK (nota >= 0 AND nota <= 10),
  descricao TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (cpf) REFERENCES usuarios(cpf) ON DELETE CASCADE,
  FOREIGN KEY (disciplina_codigo) REFERENCES disciplinas(codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir dados iniciais (seed)

-- Cursos
INSERT INTO cursos (codigo, nome, disciplinas) VALUES
('ADS', 'Análise e Desenvolvimento de Sistemas', JSON_ARRAY('ALG', 'LPG')),
('MKT', 'Marketing', JSON_ARRAY()),
('ADM', 'Administração', JSON_ARRAY())
ON DUPLICATE KEY UPDATE codigo=codigo;

-- Disciplinas
INSERT INTO disciplinas (codigo, nome, carga_horaria) VALUES
('ALG', 'Algoritmos', 60),
('LPG', 'Linguagem de Programação', 60),
('ESD', 'Estruturas de Dados', 80),
('BDD', 'Banco de Dados', 60),
('WEB', 'Desenvolvimento Web', 80)
ON DUPLICATE KEY UPDATE codigo=codigo;

-- Usuários (senha: senha123 - hash bcrypt)
-- Senha hash gerada com bcrypt rounds=10 para "senha123"
INSERT INTO usuarios (cpf, nome, email, telefone, senha, tipo_conta, tipo_conta_id, curso, situacao) VALUES
('11111111111', 'Aluno Teste', 'aluno@teste.com', '0000-0001', '$2b$10$ku7qXvU9YZBojk0E7XvO9O.PwyU/Heo9uEiZ4MN9MHLbYA5LLyxPi', 'aluno', 1, 'ADS', 'Ativo')
ON DUPLICATE KEY UPDATE cpf=cpf;

INSERT INTO usuarios (cpf, nome, email, telefone, senha, tipo_conta, tipo_conta_id, grau_academico, disciplina, carga_horaria) VALUES
('22222222222', 'Docente Teste', 'docente@teste.com', '0000-0002', '$2b$10$ku7qXvU9YZBojk0E7XvO9O.PwyU/Heo9uEiZ4MN9MHLbYA5LLyxPi', 'docente', 2, 'Mestrado', 'Algoritmos', 40)
ON DUPLICATE KEY UPDATE cpf=cpf;

INSERT INTO usuarios (cpf, nome, email, telefone, senha, tipo_conta, tipo_conta_id) VALUES
('33333333333', 'Funcionario Teste', 'func@teste.com', '0000-0003', '$2b$10$ku7qXvU9YZBojk0E7XvO9O.PwyU/Heo9uEiZ4MN9MHLbYA5LLyxPi', 'funcionario', 3)
ON DUPLICATE KEY UPDATE cpf=cpf;

INSERT INTO usuarios (cpf, nome, email, telefone, senha, tipo_conta, tipo_conta_id) VALUES
('44444444444', 'Gerente Teste', 'gerente@teste.com', '0000-0004', '$2b$10$ku7qXvU9YZBojk0E7XvO9O.PwyU/Heo9uEiZ4MN9MHLbYA5LLyxPi', 'gerente', 4)
ON DUPLICATE KEY UPDATE cpf=cpf;

-- Índices para melhor performance
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_tipo_conta ON usuarios(tipo_conta);
CREATE INDEX idx_notas_cpf ON notas(cpf);
CREATE INDEX idx_notas_disciplina_codigo ON notas(disciplina_codigo);
