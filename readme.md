# 🌐 UniNew  

![Status](https://img.shields.io/badge/Status-Finalizado-brightgreen)
![ADS](https://img.shields.io/badge/Projeto%20Integrador-ADS-blue)
![FeitoCom](https://img.shields.io/badge/Feito%20com-❤️-red)
![Frontend](https://img.shields.io/badge/Frontend-HTML%20%7C%20CSS%20%7C%20JS-yellow)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![Versionamento](https://img.shields.io/badge/Controle%20de%20Versão-GitHub-black)

---

Este é um **projeto integrador** desenvolvido para o curso de **Análise e Desenvolvimento de Sistemas (ADS)**, realizado pelos integrantes do **Grupo 10**.  
O sistema **UniNew** tem como objetivo centralizar e simplificar o gerenciamento de informações acadêmicas de **alunos, docentes, funcionários e fornecedores**, proporcionando uma interface simples e funcional.

---

## 🧩 Descrição do Aplicativo

O **UniNew** é uma aplicação web que permite o **cadastro, consulta e gerenciamento de usuários** (alunos, docentes, fornecedores e administrativos).  
O sistema foi desenvolvido de forma totalmente **estática no front-end**, utilizando **HTML, CSS e JavaScript**, e integrado a um **back-end em Node.js** para manipulação de dados e autenticação de usuários.

Durante o desenvolvimento, o foco foi em manter a **usabilidade e clareza da navegação**, permitindo que cada tipo de conta tenha acesso a funcionalidades específicas.

---

## 👥 Integrantes
- **Bruno Henrique Meira da Silva**  
- **Felipe Silva dos Santos Gomes**  
- **Gustavo Miguel Mayer**  
- **Mateus Henrique Ferreira** 
- **Wilgner Feliciano Rizzi**  

---

## 🧠 Pontos de Avaliação

### Revisitar o projeto e definir a prova de conceito
Na primeira fase do projeto **não foram identificados pontos de ajustes** pela banca.  
Durante a execução final, realizamos **pequenos ajustes em telas** e fluxos para tornar o sistema mais funcional e intuitivo.

### Preparação do ambiente de desenvolvimento
Optamos por utilizar tecnologias simples e diretas para garantir portabilidade e fácil manutenção:
- **Frontend:** HTML, CSS e JavaScript (sem frameworks)
- **Backend:** Node.js (pela familiaridade da equipe com a tecnologia)
- **Controle de versão:** Git e GitHub

---

## 🎥 Vídeo Explicativo
🔗 [Clique aqui para assistir ao vídeo de apresentação](INSIRA_O_LINK_AQUI)

---

## ⚙️ Funcionamento

Ao inserir as informações de login e senha, será verificado se as credenciais estão corretas.  
Caso afirmativo, a página é redirecionada para o **dashboard** do respectivo tipo de usuário (**Aluno**, **Docente**, **Administrativo** ou **Gerente**).  

A partir do dashboard, cada usuário poderá escolher entre as opções de serviços disponíveis.  
Para criar novos alunos ou docentes, o usuário deve clicar em **“Primeira vez aqui?”** na tela de login e preencher o cadastro.  
Após isso, o **funcionário ou gerente** deverá acessar a área de aluno ou docente e concluir o cadastro.  
Feito isso, o novo usuário terá acesso ao sistema.

> ⚠️ Como esta é uma **versão beta**, alguns usuários já foram **pré-cadastrados** no sistema, e **funcionários/gerentes** só podem ser cadastrados **via código**.

---
## 🗂 Estrutura do Projeto

```
UniNew/
│
├── Assets/
│   └── Images/
│       └── Logo.png
│
├── Js/
│   └── global.js
│
├── Styles/
│   └── global.css
│
├── Pages/
│   ├── Cadastro/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   ├── Excluir_usuario/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   ├── Gerencia/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   ├── Inserir_aluno/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   ├── Inserir_disciplina/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   ├── Inserir_docente/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   ├── Inserir_fornecedor/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   ├── Inserir_nota/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   ├── Inserir_pessoa/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   ├── Login/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   ├── Nota_aluno/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   ├── Inserir_curso/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   ├── Menu_adm/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   ├── Menu_aluno/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   ├── Menu_docente/
│   │   ├── index.html
│   │   ├── script.js
│   │   └── style.css
│
│   └── Usuarios/
│       ├── index.html
│       ├── script.js
│       └── style.css
│
├── Backend/
│   ├── database/
│   ├── controllers/
│   ├── models/
│
├── index.html
│
└── README.md
```
---

### 🔑 Logins pré-carregados:

| Tipo de Usuário | CPF          | Senha     |
|-----------------|---------------|-----------|
| Aluno           | 11111111111   | senha123  |
| Docente         | 22222222222   | senha123  |
| Funcionário     | 33333333333   | senha123  |
| Gerente         | 44444444444   | senha123  |

---

📘 **UniNew - Projeto Integrador ADS**  
Feito com ❤️ pela equipe do **Grupo 10**
