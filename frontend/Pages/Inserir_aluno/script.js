
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('alunoForm');
  if (!form) return console.warn('Form #alunoForm não encontrado');

  const cpfInput = document.getElementById('cpf');
  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const telefoneInput = document.getElementById('telefone');
  const cursoInput = document.getElementById('curso');
  const situacaoInput = document.getElementById('situacao');
  const messageEl = document.getElementById('message');

  let allCursos = [];

  function setMessage(txt, isError = false) {
    if (!messageEl) return;
    messageEl.textContent = txt || '';
    messageEl.style.color = isError ? 'crimson' : '#064e3b';
    messageEl.className = 'message' + (isError ? ' error' : ' success');
  }

  // Verificar permissão
  const usuario = API.getUsuarioLogado();
  if (!usuario) {
    setMessage('Você precisa estar logado para acessar esta página.', true);
    setTimeout(() => window.location.href = '../Login/', 2000);
    return;
  }

  const tipo = (usuario.tipo_conta || '').toLowerCase();
  if (tipo !== 'funcionario' && tipo !== 'gerente') {
    setMessage('Apenas funcionários e gerentes podem inserir alunos.', true);
    setTimeout(() => window.history.back(), 2000);
    return;
  }

  // Carregar cursos da API
  async function loadCursos() {
    try {
      const cursos = await API.get('/cursos', null, API.authHeaders());
      allCursos = cursos || [];
      
      cursoInput.innerHTML = '<option value="">Selecione um curso...</option>';
      allCursos.forEach(curso => {
        const option = document.createElement('option');
        option.value = curso.nome;
        option.textContent = curso.nome;
        cursoInput.appendChild(option);
      });
    } catch (err) {
      console.error('Erro ao carregar cursos:', err);
      cursoInput.innerHTML = '<option value="">Erro ao carregar cursos</option>';
    }
  }

  // Buscar dados ao sair do campo CPF
  cpfInput.addEventListener('blur', async () => {
    const cpf = cpfInput.value.replace(/\D/g, '').trim();
    if (!cpf || cpf.length !== 11) return;

    try {
      setMessage('Verificando CPF...');
      const user = await API.get(`/usuarios/${cpf}`, null, API.authHeaders());
      
      if (user) {
        nomeInput.value = user.nome || '';
        emailInput.value = user.email || '';
        telefoneInput.value = user.telefone || '';
        cursoInput.value = user.curso || '';
        situacaoInput.value = user.situacao || '';
        setMessage('Usuário encontrado. Edite os campos e clique em SALVAR para atualizar.');
      }
    } catch (err) {
      if (err?.status === 404) {
        setMessage('CPF não encontrado. Preencha todos os campos para criar novo aluno.');
      } else {
        console.error(err);
        setMessage('Erro ao verificar CPF.', true);
      }
    }
  });

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    setMessage('');

    const cpf = cpfInput.value.replace(/\D/g, '').trim();
    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const telefone = telefoneInput.value.trim();
    const curso = cursoInput.value;
    const situacao = situacaoInput.value;

    // Validações
    if (!cpf || cpf.length !== 11) {
      setMessage('CPF inválido. Deve ter 11 dígitos.', true);
      cpfInput.focus();
      return;
    }
    if (!nome) {
      setMessage('Nome é obrigatório.', true);
      nomeInput.focus();
      return;
    }
    if (!email) {
      setMessage('Email é obrigatório.', true);
      emailInput.focus();
      return;
    }
    if (!curso) {
      setMessage('Curso é obrigatório.', true);
      cursoInput.focus();
      return;
    }
    if (!situacao) {
      setMessage('Situação é obrigatória.', true);
      situacaoInput.focus();
      return;
    }

    try {
      setMessage('Salvando...');

      // Verificar se usuário existe
      let usuarioExiste = false;
      try {
        await API.get(`/usuarios/${cpf}`, null, API.authHeaders());
        usuarioExiste = true;
      } catch (err) {
        if (err?.status !== 404) throw err;
      }

      let result;
      if (usuarioExiste) {
        // Atualizar: PUT /api/usuarios/:cpf
        const payload = { nome, email, telefone, curso, situacao };
        result = await API.put(`/usuarios/${cpf}`, payload, API.authHeaders());
        setMessage('Aluno atualizado com sucesso!');
      } else {
        // Criar: POST /api/usuarios com senha padrão
        const payload = {
          cpf,
          nome,
          email,
          telefone,
          senha: 'senha123',
          tipo_conta: 'aluno',
          curso,
          situacao
        };
        result = await API.post('/usuarios', payload, API.authHeaders());
        setMessage('Aluno criado com sucesso!');
      }

      console.log('Resultado:', result);
      
      // Limpar formulário e voltar
      setTimeout(() => {
        form.reset();
        window.history.back();
      }, 1500);

    } catch (err) {
      console.error('Erro ao salvar aluno:', err);
      const text = err?.payload?.error || err?.payload?.message || err?.message || 'Erro ao salvar';
      setMessage(`Erro: ${text}`, true);
    }
  });

  // Carregar cursos ao iniciar
  loadCursos();
});
