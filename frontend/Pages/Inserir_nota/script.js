
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('notaForm');
  if (!form) return console.warn('#notaForm não encontrado');

  const matriculaSelect = document.getElementById('matricula');
  const disciplinaSelect = document.getElementById('disciplina');
  const notaInput = document.getElementById('nota');
  const messageEl = document.getElementById('message');
  const submitBtn = form.querySelector('button[type="submit"]');

  let allDisciplinas = [];
  let allAlunos = [];

  function showMessage(text, isError = false) {
    if (!messageEl) return;
    messageEl.textContent = text;
    messageEl.className = 'message' + (isError ? ' error' : ' success');
    messageEl.style.color = isError ? 'crimson' : '#064e3b';
  }

  function sanitize(v){ return v == null ? '' : String(v).trim(); }
  function onlyDigits(v){ return String(v||'').replace(/\D/g,''); }

  // Verificar autenticação
  const usuario = API.getUsuarioLogado();
  if (!usuario) {
    showMessage('Você precisa estar logado para acessar esta página.', true);
    setTimeout(() => window.location.href = '../Login/', 2000);
    return;
  }

  const tipo = (usuario.tipo_conta || '').toLowerCase();
  if (tipo !== 'funcionario' && tipo !== 'gerente' && tipo !== 'docente') {
    showMessage('Apenas funcionários, gerentes e docentes podem inserir notas.', true);
    setTimeout(() => window.history.back(), 2000);
    return;
  }

  // Carregar alunos
  async function loadAlunos() {
    try {
      const usuarios = await API.get('/usuarios', null, API.authHeaders());
      allAlunos = (usuarios || []).filter(u => u.tipo_conta === 'aluno');
      
      matriculaSelect.innerHTML = '<option value="">Selecione um aluno...</option>';
      allAlunos.forEach(aluno => {
        const option = document.createElement('option');
        option.value = aluno.cpf;
        option.textContent = `${aluno.nome} (${aluno.cpf})`;
        matriculaSelect.appendChild(option);
      });
    } catch (err) {
      console.error('Erro ao carregar alunos:', err);
      showMessage('Erro ao carregar alunos.', true);
    }
  }

  // Carregar disciplinas
  async function loadDisciplinas() {
    try {
      const result = await API.get('/disciplinas', null, API.authHeaders());
      allDisciplinas = result || [];
      
      disciplinaSelect.innerHTML = '<option value="">Selecione uma disciplina...</option>';
      allDisciplinas.forEach(disc => {
        const option = document.createElement('option');
        option.value = disc.id;
        option.textContent = disc.nome;
        disciplinaSelect.appendChild(option);
      });
    } catch (err) {
      console.error('Erro ao carregar disciplinas:', err);
      showMessage('Erro ao carregar disciplinas.', true);
    }
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    showMessage('');

    const cpf = matriculaSelect.value;
    const disciplinaId = parseInt(disciplinaSelect.value);
    let notaRaw = sanitize(String(notaInput.value || ''));
    
    notaRaw = notaRaw.replace(',', '.');
    const nota = parseFloat(notaRaw);

    if (!cpf) { showMessage('Selecione um aluno.', true); matriculaSelect.focus(); return; }
    if (!disciplinaId) { showMessage('Selecione uma disciplina.', true); disciplinaSelect.focus(); return; }
    if (!notaRaw || Number.isNaN(nota)) { showMessage('Informe uma nota válida.', true); notaInput.focus(); return; }
    if (!(nota >= 0 && nota <= 10)) { showMessage('Nota fora do intervalo (0 — 10).', true); notaInput.focus(); return; }

    // Buscar nome da disciplina
    const disciplinaObj = allDisciplinas.find(d => d.id === disciplinaId);
    const disciplinaNome = disciplinaObj ? disciplinaObj.nome : '';

    // Payload corrigido com disciplina_id
    const payload = {
      cpf: cpf,
      disciplina: disciplinaNome,
      disciplina_id: disciplinaId,
      nota: nota
    };

    submitBtn.disabled = true;
    submitBtn.textContent = 'Salvando...';

    try {
      if (typeof API === 'undefined') {
        throw new Error('API global não encontrada. Verifique se global.js foi carregado.');
      }

      const created = await API.post('/notas', payload, API.authHeaders());

      showMessage('Nota salva com sucesso!');
      console.log('Nota criada:', created);

      form.reset();
      await loadDisciplinas(); // Recarregar select

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

  // Carregar disciplinas e alunos ao iniciar
  loadDisciplinas();
  loadAlunos();
});
