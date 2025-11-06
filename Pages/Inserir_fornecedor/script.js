// script.js - Inserir Fornecedor (integra com global.js)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('fornecedorForm');
  if (!form) return console.warn('#fornecedorForm não encontrado');

  const cnpjInput = document.getElementById('cnpj');
  const razaoInput = document.getElementById('razao');
  const contratosInput = document.getElementById('contratos');
  const servicosInput = document.getElementById('servicos');
  const messageEl = document.getElementById('message');
  const submitBtn = form.querySelector('button[type="submit"]');

  function showMessage(text, isError = false) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.className = 'message' + (isError ? ' error' : ' success');
    messageEl.style.color = isError ? 'crimson' : '#064e3b';
  }

  function sanitize(v){ return v == null ? '' : String(v).trim(); }
  function onlyDigits(v){ return String(v || '').replace(/\D/g, ''); }

  // Garante coleções no mock para evitar "Recurso não encontrado"
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
      console.warn('[fornecedor] falha ao garantir coleções no mock:', e);
    }
  }

  // Upsert: POST then PUT if 409
  async function upsertFornecedor(payload) {
    const svc = (typeof API !== 'undefined') ? (API.fornecedores || API.resource('fornecedores')) : null;
    if (!svc) throw new Error('Serviço de fornecedores (API.fornecedores) não disponível');

    try {
      return await svc.create(payload);
    } catch (err) {
      if (err && err.status === 409) {
        const key = payload.cnpj;
        return await svc.update(encodeURIComponent(key), payload);
      }
      throw err;
    }
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    showMessage('');

    const rawCnpj = sanitize(cnpjInput.value);
    const cnpj = onlyDigits(rawCnpj);
    const razao = sanitize(razaoInput.value);
    const contratos = sanitize(contratosInput.value);
    const servicos = sanitize(servicosInput.value);

    if (!cnpj || !razao || !contratos || !servicos) {
      showMessage('Por favor, preencha todos os campos.', true);
      return;
    }

    // payload — mantém cnpj como string (sem formatação)
    const payload = {
      cnpj: cnpj,
      razao_social: razao,
      contatos: contratos.split(',').map(s => s.trim()).filter(Boolean),
      servicos: servicos.split(',').map(s => s.trim()).filter(Boolean)
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';

    try {
      if (typeof API === 'undefined') throw new Error('API global não encontrada. Verifique se global.js foi carregado antes deste script.');

      // se estiver em modo teste, garanta a coleção no mock
      ensureMockCollectionsExist(['fornecedores']);

      const result = await upsertFornecedor(payload);

      showMessage('Fornecedor salvo com sucesso.');
      console.log('Fornecedor salvo:', result);

      // limpa formulário
      form.reset();

      // volta para página anterior após 1s
      setTimeout(() => {
        try { window.history.back(); } catch (e) { window.location.href = '/'; }
      }, 1000);

    } catch (err) {
      console.error('Erro ao salvar fornecedor:', err);
      const text = err?.payload?.message || err?.message || 'Erro ao salvar fornecedor';
      showMessage(text, true);
      // se for "Recurso não encontrado", tenta criar a coleção no mock e repetir uma vez
      if (String(text).toLowerCase().includes('recurso não encontrado')) {
        try {
          ensureMockCollectionsExist(['fornecedores']);
          const retry = await upsertFornecedor(payload);
          showMessage('Fornecedor salvo com sucesso.');
          console.log('Fornecedor (retry) salvo:', retry);
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
