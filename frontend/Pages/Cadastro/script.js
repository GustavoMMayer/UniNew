document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastroForm');
  if (!form) return console.warn('Form cadastro não encontrado: #cadastroForm');

  const resource = (form.getAttribute('data-resource') || 'usuarios').toLowerCase();

  const chavePorResource = {
    fornecedores: 'cnpj',
    alunos: 'cpf',
    docentes: 'cpf',
    usuarios: 'cpf'
  };
  const chaveField = chavePorResource[resource] || 'cpf';

  const nameInput = form.querySelector('#name');
  const cpfInput = form.querySelector(`#${chaveField}`) || form.querySelector('#cpf') || form.querySelector('#cnpj');
  const emailInput = form.querySelector('#email');
  const telefoneInput = form.querySelector('#telefone');
  const messageEl = document.getElementById('message');

  const btnEditar = document.querySelector('.btn-yellow') || document.getElementById('editarBtn');
  const btnSalvar = form.querySelector('button[type="submit"]');

  if (btnEditar && btnEditar.type && btnEditar.type.toLowerCase() === 'reset') {
    btnEditar.type = 'button';
  }

  let chaveImutavel = false;
  let isAdminEditor = false;

  function setMessage(txt, isError = false) {
    if (!messageEl) return;
    messageEl.textContent = txt || '';
    messageEl.style.color = isError ? 'crimson' : '#064e3b';
  }

  function toggleInputs(enabled) {
    [nameInput, emailInput, telefoneInput].forEach(i => {
      if (!i) return;
      i.disabled = !enabled;
    });
    if (cpfInput) {
      cpfInput.disabled = chaveImutavel ? true : !enabled;
    }
    if (enabled && nameInput) nameInput.focus();
  }

  function fillFormFromUser(user) {
    if (!user) return;
    if (nameInput) nameInput.value = user.name || user.nome || '';
    if (cpfInput) cpfInput.value = user[chaveField] || user.cpf || user.cnpj || '';
    if (emailInput) emailInput.value = user.email || '';
    if (telefoneInput) telefoneInput.value = user.telefone || user.phone || '';
  }

  async function saveData(data, isUpdate = false) {
    try {
      setMessage('Salvando...');
      const svc = API[resource] || API.resource(resource);
      let resp;
      if (isUpdate) {
        resp = await svc.update(encodeURIComponent(data[chaveField]), data);
      } else {
        resp = await svc.create(data);
      }
      const usuarioAtualizado = resp && resp.usuario ? resp.usuario : resp;
      const usuarioLogado = API.getUsuarioLogado();
      if (usuarioLogado && usuarioAtualizado && usuarioLogado[chaveField] === usuarioAtualizado[chaveField]) {
        API.setUsuarioLogado(usuarioAtualizado);
      }
      if (usuarioAtualizado && usuarioAtualizado[chaveField]) {
        chaveImutavel = true;
      }
      setMessage('Dados salvos com sucesso.');
      toggleInputs(false);
      if (cpfInput && usuarioAtualizado && usuarioAtualizado[chaveField]) {
        cpfInput.value = usuarioAtualizado[chaveField];
        cpfInput.disabled = true;
      }
      setTimeout(() => {
        try { window.history.back(); } catch (e) { window.location.href = '/'; }
      }, 1000);
      return usuarioAtualizado;
    } catch (err) {
      console.error(err);
      const text = err?.payload?.message || err.message || 'Erro ao salvar';
      setMessage(`Erro: ${text}`, true);
      throw err;
    }
  }

  const usuario = API.getUsuarioLogado();
  const tipoUsuario = (usuario && (usuario.tipo_conta || usuario.tipoConta || usuario.tipo || '') || '').toString().toLowerCase();

  isAdminEditor = tipoUsuario === 'funcionario' || tipoUsuario === 'gerente' || tipoUsuario === 'adm' || tipoUsuario === 'administrador';

  // Verificar se veio do link "Primeira Vez Por Aqui"
  const urlParams = new URLSearchParams(window.location.search);
  const isNewUser = urlParams.get('new') === 'true';

  if (btnEditar) {
    if (!usuario) {
      btnEditar.style.display = 'none';
    } else {
      btnEditar.style.display = '';
    }
  }

  if (usuario && !isAdminEditor) {
    if (isNewUser) {
      // Veio do link "Primeira Vez" - não carregar dados do usuário
      chaveImutavel = false;
      toggleInputs(true);
      setMessage('Preencha os dados para criar um novo cadastro.');
    } else if (usuario[chaveField]) {
      // Acessou diretamente - carregar dados do usuário logado
      fillFormFromUser(usuario);
      chaveImutavel = true;
      toggleInputs(false);
      setMessage('Usuário carregado — clique em EDITAR para alterar (CPF/CNPJ não pode ser alterado).');
    } else {
      chaveImutavel = false;
      toggleInputs(true);
      setMessage('Preencha os dados e SALVAR.');
    }
  } else {
    chaveImutavel = false;
    toggleInputs(true);
    if (isAdminEditor) {
      setMessage('Modo editor (funcionário/gerente). Formulário em branco — preencha para criar ou informar CPF/CNPJ existente para atualizar.');
    } else {
      setMessage('Nenhum usuário logado. Preencha os dados para cadastrar um novo registro.');
    }
  }

  if (btnEditar) {
    btnEditar.addEventListener('click', (e) => {
      e.preventDefault();
      toggleInputs(true);
      setMessage('Edição habilitada. Faça suas alterações e clique em SALVAR. (CPF/CNPJ não editável se já cadastrado.)');
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMessage('');
    const data = {};
    if (nameInput) data.name = nameInput.value.trim();
    if (cpfInput) data[chaveField] = cpfInput.value.trim();
    if (emailInput) data.email = emailInput.value.trim();
    if (telefoneInput) data.telefone = telefoneInput.value.trim();
    if (!data[chaveField]) {
      setMessage(`${chaveField.toUpperCase()} é obrigatório.`, true);
      cpfInput && cpfInput.focus();
      return;
    }
    if (!data.name) {
      setMessage('Nome é obrigatório.', true);
      nameInput.focus();
      return;
    }
    const svc = API[resource] || API.resource(resource);
    let isUpdate = false;
    const usuarioAtual = API.getUsuarioLogado();
    if (usuarioAtual && usuarioAtual[chaveField] && usuarioAtual[chaveField] === data[chaveField] && !isAdminEditor) {
      isUpdate = true;
    } else {
      try {
        await svc.getById(encodeURIComponent(data[chaveField]));
        isUpdate = true;
      } catch (err) {
        isUpdate = false;
      }
    }
    if (!isUpdate) {
      if (!data.senha) data.senha = 'senha123';
      if (!data.tipo_conta && resource === 'usuarios') {
        data.tipo_conta = data.tipo_conta || 'usuario';
      }
    }
    try {
      const resultado = await saveData(data, isUpdate);
      if (resultado && resultado[chaveField]) {
        chaveImutavel = true;
        if (cpfInput) {
          cpfInput.value = resultado[chaveField];
          cpfInput.disabled = true;
        }
      }
    } catch (err) {
    }
  });

  API.onAuthChange((u) => {
    if (!u) {
      form.reset();
      chaveImutavel = false;
      isAdminEditor = false;
      toggleInputs(true);
      setMessage('Usuário deslogado. Preencha o formulário para criar um novo registro.');
      if (btnEditar) btnEditar.style.display = 'none';
    } else {
      const tipo = (u.tipo_conta || u.tipoConta || u.tipo || '').toString().toLowerCase();
      isAdminEditor = tipo === 'funcionario' || tipo === 'gerente' || tipo === 'adm' || tipo === 'administrador';
      if (btnEditar) btnEditar.style.display = '';
      
      // Sempre limpar o formulário quando entrar na tela de cadastro
      form.reset();
      chaveImutavel = false;
      toggleInputs(true);
      
      if (isAdminEditor) {
        setMessage('Modo editor ativo: preencha o formulário para criar um novo registro ou informe CPF/CNPJ existente para atualizar.');
      } else {
        setMessage('Preencha os dados para criar um novo cadastro.');
      }
    }
  });
});
