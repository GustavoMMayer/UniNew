
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('disciplinaForm');
  const discInput = document.getElementById('disciplina');
  const cargaInput = document.getElementById('carga');
  const messageEl = document.getElementById('message');
  const submitBtn = form.querySelector('button[type="submit"]');

  function showMessage(text, isError = false) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.className = 'message' + (isError ? ' error' : ' success');
    messageEl.style.color = isError ? 'crimson' : '#064e3b';
  }

  function clearMessage() {
    if (!messageEl) return;
    messageEl.textContent = '';
    messageEl.className = 'message';
  }

  function sanitize(v) {
    return v == null ? '' : String(v).trim();
  }

  // Verificar autenticação
  const usuario = API.getUsuarioLogado();
  if (!usuario) {
    showMessage('Você precisa estar logado para acessar esta página.', true);
    setTimeout(() => window.location.href = '../Login/', 2000);
    return;
  }

  const tipo = (usuario.tipo_conta || '').toLowerCase();
  if (tipo !== 'funcionario' && tipo !== 'gerente') {
    showMessage('Apenas funcionários e gerentes podem inserir disciplinas.', true);
    setTimeout(() => window.history.back(), 2000);
    return;
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    clearMessage();

    const nome = sanitize(discInput.value);
    const cargaRaw = sanitize(cargaInput.value);

    if (!nome) {
      showMessage('Informe o nome da disciplina.', true);
      discInput.focus();
      return;
    }
    if (!cargaRaw) {
      showMessage('Informe a carga horária.', true);
      cargaInput.focus();
      return;
    }
    const carga = Number(cargaRaw);
    if (!Number.isFinite(carga) || carga <= 0) {
      showMessage('Carga horária inválida (número > 0).', true);
      cargaInput.focus();
      return;
    }

    // Payload corrigido - sem campo codigo
    const payload = {
      nome: nome,
      carga_horaria: carga
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';

    try {
      if (typeof API === 'undefined') {
        throw new Error('API global não encontrada. Verifique se global.js foi carregado.');
      }

      // Tentar criar disciplina
      let result;
      try {
        result = await API.post('/disciplinas', payload, API.authHeaders());
      } catch (err) {
        // Se já existe (409), buscar pelo nome e atualizar
        if (err?.status === 409) {
          // Buscar disciplina pelo nome
          const disciplinas = await API.get('/disciplinas', API.authHeaders());
          const existente = disciplinas.find(d => d.nome.toLowerCase() === nome.toLowerCase());
          
          if (existente) {
            result = await API.put(`/disciplinas/${existente.id}`, payload, API.authHeaders());
          } else {
            throw err;
          }
        } else {
          throw err;
        }
      }

      showMessage('Disciplina salva com sucesso.');
      console.log('Disciplina result:', result);

      setTimeout(() => {
        try { window.history.back(); } catch (e) { window.location.href = '/'; }
      }, 1000);

    } catch (err) {
      console.error('Erro ao salvar disciplina:', err);
      const text = err?.payload?.error || err?.payload?.message || err?.message || 'Erro ao salvar disciplina';
      showMessage(text, true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'SALVAR';
    }
  });
});
