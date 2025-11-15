
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

  
  function codeFromName(name) {
    if (!name) return '';
    const noAcc = String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return noAcc.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '').toUpperCase();
  }

  
  function ensureMockCollectionsExist(names = []) {
    try {
      if (typeof API === 'undefined' || typeof API.getMockDb !== 'function') return;
      const mock = API.getMockDb();
      if (!mock) return;
      let changed = false;
      names.forEach(n => {
        if (!Array.isArray(mock[n])) {
          mock[n] = [];
          changed = true;
        }
      });
      if (changed) {
        localStorage.setItem('mock_db_v1', JSON.stringify(mock));
        console.log('[disciplina] mock_db_v1 atualizado com coleções:', names);
      }
    } catch (e) {
      console.warn('[disciplina] falha ao garantir coleções no mock:', e);
    }
  }

  
  async function upsertDisciplina(payload) {
    const svc = (typeof API !== 'undefined') ? (API.disciplinas || API.resource('disciplinas')) : null;
    if (!svc) throw new Error('Serviço de disciplinas (API.disciplinas) não disponível');

    try {
      return await svc.create(payload);
    } catch (err) {
      
      if (err && err.status === 409) {
        const codigo = payload.codigo;
        return await svc.update(encodeURIComponent(codigo), payload);
      }
      
      throw err;
    }
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

    
    const codigo = codeFromName(nome);
    const payload = {
      codigo: codigo,
      nome: nome,
      carga_horaria: carga
    };

    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';

    try {
      
      ensureMockCollectionsExist(['disciplinas']);

      const result = await upsertDisciplina(payload);

      showMessage('Disciplina salva com sucesso.');
      console.log('Disciplina result:', result);

      
      setTimeout(() => {
        try { window.history.back(); } catch (e) { window.location.href = '/'; }
      }, 1000);

       

    } catch (err) {
      console.error('Erro ao salvar disciplina:', err);
      const text = err?.payload?.message || err?.message || 'Erro ao salvar disciplina';
      showMessage(text, true);

      
      if (String(text).toLowerCase().includes('recurso não encontrado')) {
        try {
          ensureMockCollectionsExist(['disciplinas']);
          const retry = await upsertDisciplina(payload);
          showMessage('Disciplina salva com sucesso (após criar coleção mock).');
          console.log('Disciplina (retry) result:', retry);
          setTimeout(() => { try { window.history.back(); } catch (e) { window.location.href = '/'; } }, 1000);
          return;
        } catch (err2) {
          console.error('Retry falhou:', err2);
        }
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'SALVAR';
    }
  });
});
