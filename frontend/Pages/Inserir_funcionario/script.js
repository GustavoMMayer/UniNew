
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('funcionarioForm');
  if (!form) return console.warn('Form #funcionarioForm não encontrado');

  const cpfInput = document.getElementById('cpf');
  const nomeInput = document.getElementById('nome');
  const emailInput = document.getElementById('email');
  const telefoneInput = document.getElementById('telefone');
  const messageEl = document.getElementById('message');

  function setMessage(txt, isError = false) {
    if (!messageEl) return;
    messageEl.textContent = txt || '';
    messageEl.style.color = isError ? 'crimson' : '#064e3b';
    messageEl.className = 'message' + (isError ? ' error' : ' success');
  }

  function setFormEditable(enabled) {
    [cpfInput, nomeInput, emailInput, telefoneInput].forEach(i => { if (!i) return; i.disabled = !enabled; });
    if (enabled) cpfInput.focus();
  }

  let podeEditar = false;

  function updatePermissionAndUI(source='init') {
    const usuario = (typeof API !== 'undefined') ? API.getUsuarioLogado() : null;
    const novo = Boolean(usuario && window.isEditorFromUser(usuario));
    console.log('[inserir-funcionario] updatePermissionAndUI', { source, usuario, novo });
    podeEditar = novo;
    if (podeEditar) {
      setFormEditable(true);
      setMessage('');
    } else {
      setFormEditable(false);
      if (!usuario) setMessage('Faça login como funcionário ou gerente para editar.', true);
      else setMessage('Apenas funcionários ou gerentes podem inserir/alterar funcionários.', true);
    }
  }

  
  updatePermissionAndUI('first');
  setTimeout(()=>updatePermissionAndUI('retry-200ms'), 200);
  setTimeout(()=>updatePermissionAndUI('retry-1000ms'), 1000);

  if (typeof API !== 'undefined' && typeof API.onAuthChange === 'function') {
    API.onAuthChange((u) => {
      console.log('[inserir-funcionario] onAuthChange', u);
      updatePermissionAndUI('onAuthChange');
      if (window.isEditorFromUser(u)) form.reset();
    });
  } else {
    console.warn('[inserir-funcionario] API.onAuthChange não disponível — verifique ordem dos scripts');
  }

  
  // Removido: não carregar dados existentes ao sair do CPF

  
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    setMessage('');

    updatePermissionAndUI('before-submit');
    if (!podeEditar) { setMessage('Você não tem permissão para executar esta operação.', true); return; }

    const cpfRaw = (cpfInput.value || '').replace(/\D/g, '').trim();
    const nome = (nomeInput.value || '').trim();
    const email = (emailInput.value || '').trim();
    const telefone = (telefoneInput.value || '').trim();

    if (!cpfRaw || cpfRaw.length !== 11) { setMessage('CPF deve ter 11 dígitos.', true); cpfInput.focus(); return; }
    if (!nome) { setMessage('Nome é obrigatório.', true); nomeInput.focus(); return; }
    if (!email) { setMessage('Email é obrigatório.', true); emailInput.focus(); return; }

    try {
      setMessage('Criando funcionário...');
      const usuariosSvc = API.usuarios || API.resource('usuarios');

      const payload = {
        cpf: cpfRaw,
        nome: nome,
        email: email,
        telefone: telefone,
        tipo_conta: 'funcionario',
        senha: 'senha123'
      };

      const result = await usuariosSvc.create(payload);

      setMessage('Funcionário criado com sucesso!', false);
      console.log('Funcionário criado:', result);
      
      setTimeout(() => {
        const usuarioLogado = API.getUsuarioLogado();
        const tipo = usuarioLogado?.tipo_conta || '';
        
        if (tipo === 'gerente' || tipo === 'funcionario') {
          window.location.href = '/Pages/menu_adm/';
        } else if (tipo === 'docente') {
          window.location.href = '/Pages/menu_docente/';
        } else if (tipo === 'aluno') {
          window.location.href = '/Pages/menu_aluno/';
        } else {
          window.location.href = '/';
        }
      }, 1500);

    } catch (err) {
      console.error('Erro ao criar funcionário:', err);
      const text = err?.payload?.message || err?.message || 'Erro ao criar funcionário';
      setMessage(`Erro: ${text}`, true);
    }
  });

});
