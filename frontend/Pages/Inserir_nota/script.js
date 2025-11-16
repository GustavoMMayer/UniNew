
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

  
  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    showMessage('');

    const matriculaRaw = sanitize(matriculaInput.value);
    const cpf = onlyDigits(matriculaRaw);
    const disciplina = sanitize(disciplinaInput.value);
    let notaRaw = sanitize(String(notaInput.value || ''));
    
    notaRaw = notaRaw.replace(',', '.');
    const nota = parseFloat(notaRaw);

    if (!cpf) { showMessage('Informe o CPF do aluno.', true); matriculaInput.focus(); return; }
    if (cpf.length !== 11) { showMessage('CPF deve ter 11 dígitos.', true); matriculaInput.focus(); return; }
    if (!disciplina) { showMessage('Informe a disciplina.', true); disciplinaInput.focus(); return; }
    if (!notaRaw || Number.isNaN(nota)) { showMessage('Informe uma nota válida.', true); notaInput.focus(); return; }
    if (!(nota >= 0 && nota <= 10)) { showMessage('Nota fora do intervalo (0 — 10).', true); notaInput.focus(); return; }

    // Gerar código da disciplina a partir do nome
    const disciplinaCode = codeFromName(disciplina);

    // Payload para o backend
    const payload = {
      cpf: cpf,
      disciplina: disciplina,
      disciplina_codigo: disciplinaCode,
      nota: nota
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';

    try {
      if (typeof API === 'undefined') {
        throw new Error('API global não encontrada. Verifique se global.js foi carregado.');
      }

      // POST /api/notas
      const created = await API.post('/notas', payload, API.authHeaders());

      showMessage('Nota salva com sucesso!');
      console.log('Nota criada:', created);

      // Limpar formulário
      form.reset();

      // Redirecionar após 1 segundo
      setTimeout(() => {
        try { 
          window.history.back(); 
        } catch (e) { 
          window.location.href = '/'; 
        }
      }, 1000);

    } catch (err) {
      console.error('Erro ao salvar nota:', err);
      const text = err?.payload?.error || err?.payload?.message || err?.message || 'Erro ao salvar nota';
      showMessage(text, true);
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'SALVAR';
    }
  });
});
