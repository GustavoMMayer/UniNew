/* script.js - script genérico para página de cadastro (alunos/docentes/fornecedores/usuarios)
   Comportamento:
   - Se usuário comum (aluno/docente/usuario) logado: preenche o formulário e bloqueia a chave.
   - Se funcionário/gerente ou nenhum login: formulário inicia em branco. Ao salvar:
       * se já existir registro com a chave -> PUT (update)
       * se não existir -> POST (create) e atribui senha 'senha123' se não fornecida
   - Usa API.resource(...) para funcionar tanto com backend real quanto com MODO_TESTE.
*/

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('cadastroForm');
  if (!form) return console.warn('Form cadastro não encontrado: #cadastroForm');

  // detecta recurso
  const resource = (form.getAttribute('data-resource') || 'usuarios').toLowerCase();

  // mapeamento de chave por recurso (se fornecedor usa cnpj)
  const chavePorResource = {
    fornecedores: 'cnpj',
    alunos: 'cpf',
    docentes: 'cpf',
    usuarios: 'cpf'
  };
  const chaveField = chavePorResource[resource] || 'cpf';

  // inputs (nome padronizado)
  const nameInput = form.querySelector('#name');
  const cpfInput = form.querySelector(`#${chaveField}`) || form.querySelector('#cpf') || form.querySelector('#cnpj');
  const emailInput = form.querySelector('#email');
  const telefoneInput = form.querySelector('#telefone');
  const messageEl = document.getElementById('message');

  const btnEditar = document.querySelector('.btn-yellow');
  const btnSalvar = form.querySelector('button[type="submit"]');

  if (btnEditar && btnEditar.type && btnEditar.type.toLowerCase() === 'reset') {
    btnEditar.type = 'button';
  }

  let chaveImutavel = false; // true se o registro já tem a chave (cpf/cnpj) e não pode ser alterada
  let isAdminEditor = false;  // true se o usuário logado for funcionario/gerente (pode criar/atualizar outros)

  function setMessage(txt, isError = false) {
    if (!messageEl) return;
    messageEl.textContent = txt || '';
    messageEl.style.color = isError ? 'crimson' : '#064e3b';
  }

  function toggleInputs(enabled) {
    // Habilita/desabilita todos, mas respeita chaveImutavel para o campo chave
    [nameInput, emailInput, telefoneInput].forEach(i => {
      if (!i) return;
      i.disabled = !enabled;
    });

    if (cpfInput) {
      // Se a chave já existe (imutável), mantém desabilitado sempre.
      // Caso contrário, segue o estado 'enabled'.
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
      // escolhe recurso dinamicamente
      const svc = API[resource] || API.resource(resource);
      let resp;
      if (isUpdate) {
        resp = await svc.update(encodeURIComponent(data[chaveField]), data);
      } else {
        resp = await svc.create(data);
      }
      // backend idealmente retorna o objeto criado/atualizado
      const usuarioAtualizado = resp && resp.usuario ? resp.usuario : resp;
      // se o cadastro/atualização for para o usuário logado atual, atualiza usuario_logado
      const usuarioLogado = API.getUsuarioLogado();
      if (usuarioLogado && usuarioAtualizado && usuarioLogado[chaveField] === usuarioAtualizado[chaveField]) {
        API.setUsuarioLogado(usuarioAtualizado);
      }
      // Se salvou (criou novo), então a chave passa a ser imutável
      if (usuarioAtualizado && usuarioAtualizado[chaveField]) {
        chaveImutavel = true;
      }
      setMessage('Dados salvos com sucesso.');
      toggleInputs(false);
      return usuarioAtualizado;
    } catch (err) {
      console.error(err);
      const text = err?.payload?.message || err.message || 'Erro ao salvar';
      setMessage(`Erro: ${text}`, true);
      throw err;
    }
  }

  // Inicial: decide comportamento conforme usuário logado
  const usuario = API.getUsuarioLogado();
  const tipoUsuario = (usuario && (usuario.tipo_conta || usuario.tipoConta || usuario.tipo || '') || '').toString().toLowerCase();

  // Se usuário é funcionario ou gerente, consideramos admin/editor
  isAdminEditor = tipoUsuario === 'funcionario' || tipoUsuario === 'gerente' || tipoUsuario === 'adm' || tipoUsuario === 'administrador';

  if (usuario && !isAdminEditor) {
    // Usuário normal (aluno/docente/usuario) — preenche e trava chave se existir
    if (usuario[chaveField]) {
      fillFormFromUser(usuario);
      chaveImutavel = true; // chave já existe -> não pode ser alterada
      toggleInputs(false);
      setMessage('Usuário carregado — clique em EDITAR para alterar (CPF/CNPJ não pode ser alterado).');
    } else {
      // caso o usuario_logado exista mas não tenha a chave do recurso, deixamos editar
      chaveImutavel = false;
      toggleInputs(true);
      setMessage('Preencha os dados e SALVAR.');
    }
  } else {
    // Nenhum usuário logado, ou usuário é funcionario/gerente: inicia em branco
    chaveImutavel = false;
    toggleInputs(true);
    if (isAdminEditor) {
      setMessage('Modo editor (funcionário/gerente). Formulário em branco — preencha para criar ou informar CPF/CNPJ existente para atualizar.');
    } else {
      setMessage('Nenhum usuário logado. Preencha os dados para cadastrar um novo registro.');
    }
  }

  // editar
  btnEditar && btnEditar.addEventListener('click', (e) => {
    e.preventDefault();
    // habilita edição, mas se a chave for imutável, mantemos o campo chave desabilitado
    toggleInputs(true);
    setMessage('Edição habilitada. Faça suas alterações e clique em SALVAR. (CPF/CNPJ não editável se já cadastrado.)');
  });

  // salvar
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMessage('');

    const data = {};
    if (nameInput) data.name = nameInput.value.trim();
    if (cpfInput) data[chaveField] = cpfInput.value.trim();
    if (emailInput) data.email = emailInput.value.trim();
    if (telefoneInput) data.telefone = telefoneInput.value.trim();

    // Validações
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

    // decide se é update ou create:
    // regra:
    // - se o usuário logado é normal e tem mesma chave -> update (mesma lógica antiga)
    // - caso contrário (admin/editor ou sem login), tentamos GET no recurso com a chave:
    //     * se encontrado -> update (PUT)
    //     * se não encontrado -> create (POST)
    const svc = API[resource] || API.resource(resource);

    let isUpdate = false;
    const usuarioAtual = API.getUsuarioLogado();
    if (usuarioAtual && usuarioAtual[chaveField] && usuarioAtual[chaveField] === data[chaveField] && !isAdminEditor) {
      // caso do usuário normal editando seu próprio registro
      isUpdate = true;
    } else {
      // tentar checar existência no servidor (mock ou real)
      try {
        await svc.getById(encodeURIComponent(data[chaveField]));
        // se não lançar erro, registro existe -> será update
        isUpdate = true;
      } catch (err) {
        // se 404 => não existe -> create
        isUpdate = false;
      }
    }

    // se for criar novo registro e não tiver senha, atribui 'senha123' (requisito)
    if (!isUpdate) {
      if (!data.senha) data.senha = 'senha123';
      // também atribuir um tipo padrão se necessário (opcional)
      if (!data.tipo_conta && resource === 'usuarios') {
        // se o formulário não tem tipo, por padrão 'usuario'
        data.tipo_conta = data.tipo_conta || 'usuario';
      }
    }

    try {
      const resultado = await saveData(data, isUpdate);

      // após criar novo registro, se for criado com chave, travamos a chave
      if (resultado && resultado[chaveField]) {
        chaveImutavel = true;
        if (cpfInput) {
          cpfInput.value = resultado[chaveField];
          cpfInput.disabled = true;
        }
      }
    } catch (err) {
      /* mensagem já mostrada em saveData */
    }
  });

  // reagir a auth changes (opcional)
  API.onAuthChange((u) => {
    if (!u) {
      form.reset();
      chaveImutavel = false;
      isAdminEditor = false;
      toggleInputs(true);
      setMessage('Usuário deslogado. Preencha o formulário para criar um novo registro.');
    } else {
      const tipo = (u.tipo_conta || u.tipoConta || u.tipo || '').toString().toLowerCase();
      isAdminEditor = tipo === 'funcionario' || tipo === 'gerente' || tipo === 'adm' || tipo === 'administrador';
      if (!isAdminEditor && u[chaveField]) {
        fillFormFromUser(u);
        chaveImutavel = true;
        toggleInputs(false);
        setMessage('Dados atualizados via login.');
      } else {
        // admin logou: limpa formulário para criar/atualizar outros
        form.reset();
        chaveImutavel = false;
        toggleInputs(true);
        setMessage('Modo editor ativo: preencha o formulário para criar um novo registro ou informe CPF/CNPJ existente para atualizar.');
      }
    }
  });
});
