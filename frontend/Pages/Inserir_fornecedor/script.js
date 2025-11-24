
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

  // Verificar autenticação
  const usuario = API.getUsuarioLogado();
  if (!usuario) {
    showMessage('Você precisa estar logado para acessar esta página.', true);
    setTimeout(() => window.location.href = '../Login/', 2000);
    return;
  }

  const tipo = (usuario.tipo_conta || '').toLowerCase();
  if (tipo !== 'funcionario' && tipo !== 'gerente') {
    showMessage('Apenas funcionários e gerentes podem inserir fornecedores.', true);
    setTimeout(() => window.history.back(), 2000);
    return;
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

    
    const payload = {
      cnpj: cnpj,
      razao_social: razao,
      contatos: contratos.split(',').map(s => s.trim()).filter(Boolean),
      servicos: servicos.split(',').map(s => s.trim()).filter(Boolean)
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';

    try {
      if (typeof API === 'undefined') {
        throw new Error('API global não encontrada. Verifique se global.js foi carregado antes deste script.');
      }

      // Tentar criar fornecedor
      let result;
      try {
        result = await API.post('/fornecedores', payload, API.authHeaders());
      } catch (err) {
        // Se já existe (409), atualizar
        if (err?.status === 409) {
          result = await API.put(`/fornecedores/${cnpj}`, payload, API.authHeaders());
        } else {
          throw err;
        }
      }

      showMessage('Fornecedor salvo com sucesso.');
      console.log('Fornecedor salvo:', result);

      form.reset();

      setTimeout(() => {
        try { window.history.back(); } catch (e) { window.location.href = '/'; }
      }, 1000);

    } catch (err) {
      console.error('Erro ao salvar fornecedor:', err);
      const text = err?.payload?.error || err?.payload?.message || err?.message || 'Erro ao salvar fornecedor';
      showMessage(text, true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'SALVAR';
    }
  });
});
