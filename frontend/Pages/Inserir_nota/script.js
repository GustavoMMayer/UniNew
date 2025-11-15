
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('notaForm');
  if (!form) return console.warn('#notaForm não encontrado');

  const matriculaInput = document.getElementById('matricula');
  const disciplinaInput = document.getElementById('disciplina');
  const notaInput = document.getElementById('nota');
  const messageEl = document.getElementById('message');
  const submitBtn = form.querySelector('button[type="submit"]');

  function showMessage(text, isError = false) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.className = 'message' + (isError ? ' error' : ' success');
    messageEl.style.color = isError ? 'crimson' : '#064e3b';
  }

  function sanitize(v){ return v == null ? '' : String(v).trim(); }
  function onlyDigits(v){ return String(v||'').replace(/\D/g,''); }

  function codeFromName(name) {
    if (!name) return '';
    const noAcc = String(name).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return noAcc.replace(/\s+/g,'_').replace(/[^a-zA-Z0-9_]/g,'').toUpperCase();
  }

  
  function ensureMockCollectionsExist(names = []) {
    try {
      if (typeof API === 'undefined' || typeof API.getMockDb !== 'function') return;
      const mock = API.getMockDb();
      if (!mock) return;
      let changed = false;
      names.forEach(n => {
        if (!Array.isArray(mock[n])) { mock[n] = []; changed = true; }
      });
      if (changed) localStorage.setItem('mock_db_v1', JSON.stringify(mock));
    } catch (e) {
      console.warn('[notas] erro ao garantir coleções no mock:', e);
    }
  }

  
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    showMessage('');

    const matriculaRaw = sanitize(matriculaInput.value);
    const cpf = onlyDigits(matriculaRaw);
    const disciplina = sanitize(disciplinaInput.value);
    let notaRaw = sanitize(String(notaInput.value || ''));
    
    notaRaw = notaRaw.replace(',', '.');
    const nota = parseFloat(notaRaw);

    if (!cpf) { showMessage('Informe a matrícula (CPF).', true); matriculaInput.focus(); return; }
    if (!disciplina) { showMessage('Informe a disciplina.', true); disciplinaInput.focus(); return; }
    if (!notaRaw || Number.isNaN(nota)) { showMessage('Informe uma nota válida.', true); notaInput.focus(); return; }
    if (!(nota >= 0 && nota <= 10)) { showMessage('Nota fora do intervalo (0 — 10).', true); notaInput.focus(); return; }

    
    const disciplinaCode = codeFromName(disciplina);
    const id = `${cpf}_${disciplinaCode}`;

    const payload = {
      id: id,
      cpf: cpf,
      disciplina: disciplina,
      disciplina_codigo: disciplinaCode,
      nota: nota,
      criadoEm: new Date().toISOString()
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';

    try {
      if (typeof API === 'undefined') throw new Error('API global não encontrada. Verifique se global.js foi carregado antes deste script.');

      
      ensureMockCollectionsExist(['notas']);

      const notasSvc = API.notas || API.resource('notas');

      
      const created = await notasSvc.create(payload);

      showMessage('Nota salva com sucesso.');
      console.log('Nota criada:', created);

      
      form.reset();

      
      setTimeout(() => { try { window.history.back(); } catch (e) { window.location.href = '/'; } }, 1000);

    } catch (err) {
      console.error('Erro ao salvar nota:', err);
      const text = err?.payload?.message || err?.message || 'Erro ao salvar nota';
      showMessage(text, true);

      
      if (String(text).toLowerCase().includes('recurso não encontrado')) {
        try {
          ensureMockCollectionsExist(['notas']);
          const notasSvc = API.notas || API.resource('notas');
          const created2 = await notasSvc.create(payload);
          showMessage('Nota salva com sucesso.');
          console.log('Nota criada (retry):', created2);
          setTimeout(() => { try { window.history.back(); } catch (e) { window.location.href = '/'; } }, 1000);
          return;
        } catch (err2) {
          console.error('Retry falhou:', err2);
          showMessage(err2?.payload?.message || err2?.message || 'Erro ao salvar nota (retry)', true);
        }
      }
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'SALVAR';
    }
  });
});
